import { ethers } from 'ethers';
import { decompressSync } from 'fflate';
import initACVM, { executeCircuit, compressWitness } from '@noir-lang/acvm_js';
import circuit from '../../contract-artifacts/hangman_noir.json';
import { decode } from "@stablelib/base64";

async function generateProof(input, updateStatus) {
  await updateStatus("Initializing noir...");

  const { Barretenberg, RawBuffer, Crs } = await import('@aztec/bb.js');

  const acirBuffer = decode(circuit.bytecode);
  const acirBufferUncompressed = decompressSync(acirBuffer);

  await initACVM();
  const api = await Barretenberg.new(4);

  const [_, total] = await api.acirGetCircuitSizes(acirBufferUncompressed);
  const subgroupSize = Math.pow(2, Math.ceil(Math.log2(total)));
  const crs = await Crs.new(subgroupSize + 1);
  await api.commonInitSlabAllocator(subgroupSize);
  await api.srsInitSrs(
    new RawBuffer(crs.getG1Data()),
    crs.numPoints,
    new RawBuffer(crs.getG2Data()),
  );

  const acirComposer = await api.acirNewAcirComposer(subgroupSize);

  async function generateWitness(input, acirBuffer) {
    const initialWitness = new Map();
    input.forEach((el, i) => {
      initialWitness.set(i + 1, ethers.zeroPadValue(`0x${el.toString(16).padStart(2, '0')}`, 32));
    });

    const witnessMap = await executeCircuit(acirBuffer, initialWitness, () => {
      throw Error('unexpected oracle');
    });

    const witnessBuff = compressWitness(witnessMap);
    return witnessBuff;
  }

  async function generateProofInternal(witness) {
    const proof = await api.acirCreateProof(
      acirComposer,
      acirBufferUncompressed,
      decompressSync(witness),
      false,
    );

    return proof;
  }

  await updateStatus("Creating witness...");
  const witness = await generateWitness(input, acirBuffer);
  
  await updateStatus("Generating proof...");
  const proof = await generateProofInternal(witness);

  api.destroy();

  return proof;
}

export default { generateProof };