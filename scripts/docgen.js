// @ts-check

const fs = require('node:fs');
const path = require('node:path');
const functionArray = [];
main(path.join(process.cwd(), 'dist', 'functions'));
write();

/**
 * This function is used to read all the functions in the functions directory and write them to a json file.
 *
 * @param {string} functionDir - The directory of the functions.
 * @returns {void} - Nothing.
 */
function main(functionDir) {
    const files = fs.readdirSync(functionDir);
    for (const file of files) {
        const filePath = path.join(functionDir, file);
        if (fs.statSync(filePath).isDirectory()) {
            main(filePath);
        } else {
            if (!file.endsWith('.js')) continue;
            let FunctionClass = void 0;
            try {
                FunctionClass = require(filePath).default ?? require(filePath);
                if (!FunctionClass) continue;
                // @ts-ignore
                const func = new FunctionClass();
                functionArray.push({
                    name: func.name,
                    description: func.description ?? 'No description provided.',
                    all: func.withParams,
                    example: func.example ?? 'No example provided.',
                    returns: func.returns ?? void 0,
                    params: Array.isArray(func.fields)
                        ? func.fields.map((p) => ({
                              name: p.required ? `${p.name}` : `${p.name}?`,
                              type: p.type.toLowerCase(),
                              required: p.required ?? false,
                              description: p.description ?? 'No description provided.'
                          }))
                        : []
                });
            } catch (err) {
                console.error(err);
            }
        }
    }
}

/**
 * This function is used to write the functions to a json file.
 *
 * @returns {void} - Nothing.
 */
function write() {
    const scriptsDir = path.join(process.cwd(), 'scripts');
    if (!fs.existsSync(scriptsDir)) fs.mkdirSync(scriptsDir, { recursive: true });
    const outputPath = path.join(scriptsDir, 'functions.json');
    fs.rmSync(outputPath, { force: true });
    fs.writeFileSync(outputPath, JSON.stringify(functionArray, null, 4));
}
