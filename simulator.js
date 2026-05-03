let cpu = {
    registers: new Array(11).fill(0), 
    pc: 0 
};

function runProgram() {
    const codeArea = document.getElementById('code');
    const code = codeArea.value.split('\n');

    cpu.pc = 0;
    cpu.registers.fill(0);
    document.getElementById('console').innerHTML = "";

    while (cpu.pc < code.length) {
        let rawLine = code[cpu.pc].trim();
        if (rawLine === "" || rawLine.startsWith(';')) { 
            cpu.pc++; 
            continue; 
        }

        let parts = rawLine.split(/\s+/);
        let instruction = parts[0].toUpperCase();
        let status = execute(instruction, parts.slice(1));

        if (status === "HALT") break;
        if (status !== true) cpu.pc++; 
    }
    updateUI();
}

function execute(instr, args) {
    const getReg = (r) => {
        let idx = parseInt(r.toUpperCase().replace('R', ''));
        if (isNaN(idx) || idx < 0 || idx >= cpu.registers.length) throw new Error(`Invalid Register: ${r}`);
        return idx;
    };

    try {
        switch(instr) {
            case "LOAD": cpu.registers[getReg(args[0])] = parseFloat(args[1]); break;
            case "ADD": cpu.registers[getReg(args[0])] = cpu.registers[getReg(args[1])] + cpu.registers[getReg(args[2])]; break;
            case "SUB": cpu.registers[getReg(args[0])] = cpu.registers[getReg(args[1])] - cpu.registers[getReg(args[2])]; break;
            case "MUL": cpu.registers[getReg(args[0])] = cpu.registers[getReg(args[1])] * cpu.registers[getReg(args[2])]; break;
            case "DIV": 
                if (cpu.registers[getReg(args[2])] === 0) throw new Error("Division by Zero");
                cpu.registers[getReg(args[0])] = cpu.registers[getReg(args[1])] / cpu.registers[getReg(args[2])]; 
                break;
            case "JUMP": cpu.pc = parseInt(args[0]) - 1; return true;
            case "BEQ": 
                if (cpu.registers[getReg(args[0])] === cpu.registers[getReg(args[1])]) {
                    cpu.pc = parseInt(args[2]) - 1;
                    return true;
                }
                break;
            case "HALT": return "HALT";
            default: throw new Error(`Unknown Instruction: ${instr}`);
        }
    } catch (e) {
        document.getElementById('console').innerHTML += `<span style="color:#fb4934;">ERROR: ${e.message}</span><br>`;
        return "HALT";
    }
}

function updateUI() {
    document.getElementById('registers').innerText = `Registers: [${cpu.registers.join(', ')}]`;
    document.getElementById('pc').innerText = `PC: ${cpu.pc}`;
    document.getElementById('console').innerHTML += `<div style="color:#b8bb26;">> Program Finished. Final R0: ${cpu.registers[0]}</div>`;
}

function clearAll() {
    cpu.registers.fill(0);
    cpu.pc = 0;
    document.getElementById('console').innerHTML = "Console Cleared.";
    updateUI();
}
