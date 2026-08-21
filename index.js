console.log("Starting Scriptcraft!");

import path from "path";
import fs from "fs";

import { spawn, fork } from "child_process";
import file from "./modules/file.js";

//check ram of the system
import os from "os";
const totalRam = os.totalmem();
//use at most 80% of the ram
const maxRam = Math.floor(totalRam * 0.8);
const ramInGigabytes = Math.floor(maxRam / 1024 / 1024 / 1024);
console.log(`Using ${ramInGigabytes}GB of RAM`);

(async () => {
	//remove old Minecraft world
	fs.rmSync(path.join("./minecraft", "world"), { recursive: true, force: true });

	//copies clean Minecraft world
	let clean_world;
	if (fs.existsSync("./custom-clean-world") && fs.readdirSync(path.join("./custom-clean-world")).filter((f) => !f.startsWith(".")).length > 0) {
		clean_world = path.join("./custom-clean-world", fs.readdirSync(path.join("./custom-clean-world")).filter((f) => !f.startsWith("."))[0]);
		console.log(`replacing world with ${clean_world}`);
	} else {
		clean_world = path.join("./minecraft/world_clean");
	}
	file.cp(path.join(`${clean_world}`), path.join("./minecraft/world"));

	const server = spawn("java", ["-jar", `-Xms${ramInGigabytes}G`, `-Xmx${ramInGigabytes}G`, "server.jar"], { cwd: "./minecraft" });

	//hot reload
	let scriptcraft;
	const spawnScriptcraft = () => {
		scriptcraft = fork("./modules/scriptcraft.js");
		scriptcraft.alive = true;

		scriptcraft.on("message", (msg) => {
			server.stdin.write(msg.toString() + "\n");
		});

		scriptcraft.on("close", () => {
			scriptcraft.alive = false;
			scriptcraft.kill();
			spawnScriptcraft();
		});
	};

	spawnScriptcraft();

	fs.watch("./modules", () => {
		scriptcraft.kill();
	});

	server.stdout.on("data", (buffer) => {
		if (scriptcraft.alive) {
			scriptcraft.send(buffer.toString().replace("\n", ""));
		}
	});
})();
