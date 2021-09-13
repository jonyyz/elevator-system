import chalk from "chalk";
import readline from "readline";

const DIRECTION_NONE = 0;
const DIRECTION_UP = 1;
const DIRECTION_DOWN = 2;

class Elevator {
  constructor(numFloors) {
    this.numFloors = numFloors;
    this.currentFloor = 1;
    this.requests = [];
    this.currentRequest = null;

    this.tick = this.tick.bind(this);
  }

  summonToFloor(floor) {
    this.requests.push({ floor });
  }

  tick() {
    if (
      this.currentRequest &&
      this.currentRequest.floor === this.currentFloor
    ) {
      console.log(`--- ARRIVED AT FLOOR ${this.currentFloor}!`);
      this.currentRequest = null;
      const nextMessage =
        this.requests.length > 0
          ? `NEXT STOP, FLOOR ${this.requests[0].floor}`
          : `NO MORE REQUESTS, GOING IDLE`;
      console.log(`--- ${nextMessage}`);
    }

    if (!this.currentRequest && this.requests.length > 0) {
      this.currentRequest = this.requests.shift();
    }

    const { currentFloor, currentRequest, requests } = this;

    console.log(chalk`--- Current Floor:   {whiteBright ${this.currentFloor}}`);
    const status = currentRequest
      ? `Going to floor #${currentRequest.floor}`
      : "IDLE";
    console.log(chalk`--- Status:          {whiteBright ${status}}`);
    console.log(
      chalk`--- Queued Requests: {whiteBright [${requests
        .map(({ floor }) => floor)
        .join(", ")}]}`
    );

    if (this.currentRequest) {
      this.updateCurrentRequest();
    }
  }

  updateCurrentRequest() {
    const { floor } = this.currentRequest;

    if (floor < this.currentFloor) --this.currentFloor;
    else ++this.currentFloor;
  }
}

class ElevatorSystem {
  constructor(numElevators, numFloors) {
    this.elevators = new Array(numElevators)
      .fill(0)
      .map(() => new Elevator(numFloors));
    this.currentTick = 0;
  }

  summonElevatorToFloor(elevator, floor) {
    this.elevators[elevator - 1].summonToFloor(floor);
  }

  tick() {
    const header =
      chalk`{yellowBright =========} ` +
      chalk`{cyanBright TICK ${++this.currentTick}} ` +
      chalk`{yellowBright =========}`;
    console.log();
    const { elevators } = this;

    console.log(header);
    console.log(chalk`Number of Elevators: {whiteBright ${elevators.length}}`);
    console.log();

    this.elevators.forEach(({ tick }, index) => {
      console.log(chalk`Elevator {whiteBright #${index + 1}}:`);
      void tick();
    });

    console.log();
    console.log("=".repeat(header.length));
  }
}

const NUM_ELEVATORS = 2;
const NUM_FLOORS = 10;

const elevatorSystem = new ElevatorSystem(NUM_ELEVATORS, NUM_FLOORS);

elevatorSystem.summonElevatorToFloor(1, 8);
elevatorSystem.summonElevatorToFloor(1, 2);
elevatorSystem.summonElevatorToFloor(1, 10);
elevatorSystem.summonElevatorToFloor(2, 7);

console.log(
  chalk`{yellowBright ==============================================}`
);
console.log(chalk`{cyanBright ELEVATOR SIMULATOR}`);
console.log(
  chalk`{yellowBright ==============================================}`
);
console.log();
console.log(chalk`Number of Elevators: {whiteBright ${NUM_ELEVATORS}}`);
console.log(chalk`Number of Floors:    {whiteBright ${NUM_FLOORS}}`);
console.log();
console.log(chalk`{cyanBright ELEVATOR REQUEST QUEUES:}`);
console.log(chalk`{yellowBright -----------------------}`);

elevatorSystem.elevators.forEach(({ requests }, index) => {
  console.log(chalk`Elevator {whiteBright #${index + 1}}`);
  requests.forEach(
    ({ floor }) => void console.log(chalk`--- Floor: {whiteBright ${floor}}`)
  );
});

console.log();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: chalk`{yellowBright [}{cyanBright N}{yellowBright ]}ext Tick or {yellowBright [}{cyanBright Q}{yellowBright ]}uit> `,
});

rl.prompt();

rl.on("line", (line) => {
  switch (line.trim().toLowerCase()) {
    case "n":
      elevatorSystem.tick();
      break;
    case "q":
      rl.close();
      return;
  }

  rl.prompt();
}).on("close", () => {
  console.log("Have a great day!");
});
