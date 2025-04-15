
// custom enum for lightSensor function
enum SBLdr {
    Left = 0,
    Right = 1
}

// custom enum for IRSensor
enum SBIRSensor {
    //% block="left"
    Left,
    //% block="right"
    Right
}

// custom enum for ping unit
enum SBPingUnit {
    //% block="μs"
    MicroSeconds,
    //% block="cm"
    Centimeters,
    //% block="inches"
    Inches
}

// custom enum for setPinMode function
enum SBMode {
    //% block="input"
    Input = 0,
    //% block="output"
    Output = 1,
}

// custom enum for pins
enum SBPin {
    //% block=Sv5
    Sv5 = 0,
    //% block=Sv6
    Sv6 = 1,
}

// address for MCP23017 (configurable by tying pins 15,16,17 on the mcp23017 high or low)
enum SBAddress {
    //% block=0x20
    A20 = 0x20,
}

// custom enum for SetPort
enum SBSetPort {
    //% block=PORT_A
    A = 0,
    //% block=PORT_B
    B = 256
}

// custom enum for writeNumberToPort function
enum SBREG_PIO {
    //% block=PORT_A
    A = 4608,
    //% block=PORT_B
    B = 4864
}

// custom enum for moveIt function
enum SBMove {
    //% block="forward"
    Forward = 0,
    //% block="backward"
    Backward = 1,
    //% block="left"
    Left = 2,
    //% block="right"
    Right = 3,
    //% block="stop"
    Stop = 4,
}

/**
* Custom blocks
*/
//% weight=100 color=blue icon="\uf1b9"
namespace stembot {
    // initial values of outputABuffer and outputBBuffer
    let outputABuffer = 0;
    let outputBBuffer = 0;

    // address for MCP23017
    let myMCP23017Address = SBAddress.A20

    export function setPortAsOutput(port: SBSetPort) {
        pins.i2cWriteNumber(myMCP23017Address, port + 0x00, NumberFormat.UInt16BE)
    }
    export function setupSimplePulsingOnAddress(address: SBAddress) {
        myMCP23017Address = address
        setPortAsOutput(SBSetPort.A)
        // setPortAsOutput(SBSetPort.B)
    }
    export function setOutputA(bit: number) {
        outputABuffer = outputABuffer | (1 << bit)
    }
    export function clearOutputA(bit: number) {
        let tempMask = 1 << bit
        tempMask = tempMask ^ 0B11111111
        outputABuffer = outputABuffer & tempMask
    }
    export function writeNumberToPort(port: SBREG_PIO, value: number) {
        pins.i2cWriteNumber(myMCP23017Address, port + value, NumberFormat.UInt16BE)
    }
    export function updateOutputA() {
        writeNumberToPort(4608, outputABuffer)
    }

    // Block for Starting the Motor
    /**
      * To start the motor
      */
    //% weight=100
    //% block="start motor"
    export function setup(): void {
        setupSimplePulsingOnAddress(SBAddress.A20);
        //setPortAsOutput(SBSetPort.A);
    }

    // Block for setting the Mode of Pin
    /**
      * set mode of pin
      * @param mode mode of pin input or output
      */
    //% weight=90
    //% block="Set pinMode $mode"
    export function setPinMode(mode: SBMode): void {
        if (mode == 1) {
            setupSimplePulsingOnAddress(SBAddress.A20);
            //setPortAsOutput(SBSetPort.A);
        }
    }

    // Block for Line Sensor
    /**
      * detect the object
      * @param sensor set sensor Left or Light
      */
    //% weight=80
    //% block="line sensor %sensor"
    export function readLine(sensor: SBIRSensor): number {
        if (sensor == SBIRSensor.Left)
            return pins.digitalReadPin(DigitalPin.P14);
        else
            return pins.digitalReadPin(DigitalPin.P13);
    }

    // Block for Light Sensor
    /**
      * detect the light
      * @param side set sensor Left or Right
      */
    //% weight=70
    //% block="light sensor $side"
    export function lightSensor(side: SBLdr): number {
        pins.i2cWriteNumber(32, 19, NumberFormat.Int8BE)
        let ldrRead = pins.i2cReadNumber(32, NumberFormat.Int8LE);
        if (side == 0) {
            if ((ldrRead == 4 || ldrRead == 42) || (ldrRead == -124)) {
                return 1;
            }
            else if (ldrRead == 12) {
                return 1;
            }
            else {
                return 0;
            }
        }
        else if (side == 1) {
            if ((ldrRead == 8 || ldrRead == 82) || (ldrRead == -128)) {
                return 1;
            }
            else if (ldrRead == 12) {
                return 1;
            }
            else {
                return 0;
            }
        }
        else {
            return 0;
        }
    }

    // Block for Read Sonar Unit
    /**
      * detect the distance
      * @param unit set unit in μs, cm or inch
      */
    //% weight=60
    //% block="Read sonar in unit %unit"
    export function ping(unit: SBPingUnit, maxCmDistance = 500): number {
        let trigger = DigitalPin.P1;
        let pecho = DigitalPin.P2;
        pins.setPull(trigger, PinPullMode.PullNone);
        pins.digitalWritePin(trigger, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trigger, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trigger, 0);
        // read pulse
        const d = pins.pulseIn(pecho, PulseValue.High, maxCmDistance * 58);
        switch (unit) {
            case SBPingUnit.Centimeters: return Math.idiv(d, 58);
            case SBPingUnit.Inches: return Math.idiv(d, 148);
            default: return d;
        }
    }

    // Block for Move Motor
    /**
      * set direction to move motor or stop motor
      * @param direction move Forward, Backward, Left, Right or Stop
      */
    //% weight=50
    //% block="move $direction"
    export function moveIt(direction: SBMove): void {
        if (direction == 0) {
            setOutputA(4)
            setOutputA(5)
            setOutputA(0)
            clearOutputA(1)
            clearOutputA(2)
            setOutputA(3)
            updateOutputA()
        }
        else if (direction == 1) {
            setOutputA(4)
            setOutputA(5)
            setOutputA(1)
            clearOutputA(0)
            clearOutputA(3)
            setOutputA(2)
            updateOutputA()
        }
        else if (direction == 2) {
            setOutputA(4)
            setOutputA(5)
            setOutputA(0)
            clearOutputA(1)
            clearOutputA(3)
            setOutputA(2)
            updateOutputA()
        }
        else if (direction == 3) {
            setOutputA(4)
            setOutputA(5)
            setOutputA(1)
            clearOutputA(0)
            clearOutputA(2)
            setOutputA(3)
            updateOutputA()
        }
        else {
            clearOutputA(0)
            clearOutputA(1)
            clearOutputA(2)
            clearOutputA(3)
            clearOutputA(4)
            clearOutputA(5)
            updateOutputA()
        }
    }

    // Block for Digital Read
    /**
      * digital read on selected pin
      * @param pin set pin Sv5 or Sv6
      */
    //% weight=40
    //% block="digital read $pin"
    export function digitalRead(pin: SBPin): number {
        pins.i2cWriteNumber(32, 18, NumberFormat.Int8BE)
        let read_pin = pins.i2cReadNumber(32, NumberFormat.Int8LE);
        if (pin == 0) {
            if (read_pin >= 10 || read_pin == -64) {
                return 1;
            }
            else {
                return 0;
            }
        }
        else if (pin == 1) {
            if (read_pin < -1 || read_pin == -64) {
                return 1;
            }
            else {
                return 0;
            }
        }
        else {
            return 0;
        }
    }

    // Block for Digital Write
    /**
      * digital write on selected pin
      * @param pin set pin Sv5 or Sv6
      * @param flag set 0 or 1
      */
    //% weight=30
    //% block="digital write $pin $flag"
    //% flag.shadow="toggleOnOff"
    export function digitalWrite(pin: SBPin, flag: boolean): void {
        if (pin == 0) {
            if (flag) {
                setOutputA(6)
                updateOutputA()
            }
            else {
                clearOutputA(6)
                updateOutputA()
            }
        }
        else {
            if (flag) {
                setOutputA(7)
                updateOutputA()
            }
            else {
                clearOutputA(7)
                updateOutputA()

            }
        }
    }
}
