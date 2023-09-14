import gameReader from '../blockchain/game-reader';

export default async function gameLoader({ params }) {
    return await gameReader.read(params.id);
}