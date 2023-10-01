import { initialize } from "zokrates-js";

async function generateProof(input, updateStatus) {
    await updateStatus("Initializing zokrates...");
    const zokratesProvider = await initialize();

    const code = `
        import "hashes/sha256/sha256Padded" as sha256;

        def main(private u8[16] word, u32[8] hash, u8 symbol) -> bool[16] {
            u32[8] computedHash = sha256(word);
            for u32 i in 0..7 {
                assert(computedHash[i] == hash[i]);
            }
        
            bool[16] mut result = [false;16];
            for u32 i in 0..16 {
                bool match = word[i] == symbol;
                result[i] = match;
                assert(result[i] == match);
            }
            
            return result;
        }
    `;

    await updateStatus("Compiling zokrates program...");
    const artifacts = zokratesProvider.compile(code);

    await updateStatus("Computing witness...");
    const { witness } = zokratesProvider.computeWitness(artifacts, input);

    await updateStatus("Generating proof...");
    const proovingKey = await getProovingKey();
    const proof = zokratesProvider.generateProof(artifacts.program, witness, proovingKey);

    await updateStatus("");
    
    return proof;
}

async function getProovingKey() {
    const response = await fetch('/proving.key')
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();

    return [...new Uint8Array(buffer)];
}

export default { generateProof };