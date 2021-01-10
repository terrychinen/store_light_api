import { App } from './app';

main();

async function main() {
    const app = new App();
    await app.listen();
}