# Stembot: Extension for Microbit PXT

This library provides a Microsoft PXT package for Stembot, see https://www.tinkermart.in/shop/stembot/.

## Move/Drive the robot

The simplest way to drive the bot is by using the moveIt(...) function. With each of these blocks you can specify FORWARD or BACKWARD.
```blocks
stembot.setup()
basic.forever(function () {
    stembot.moveIt(SBMOVE.Forward)
    basic.pause(100)
    stembot.moveIt(SBMOVE.Backward)
    basic.pause(100)
})
```

You can also spin/rotate the bot with the moveIt(SBMOVE.Left) or moveIt(SBMOVE.Right) function.
```blocks
stembot.setup()
basic.forever(function () {
    stembot.moveIt(SBMOVE.Left)
    basic.pause(100)
    stembot.moveIt(SBMOVE.Right)
    basic.pause(100)
})
```

## Read sonar value

After you have mounted the sonar sensor in the Bot, you can use the ping(...) function to read the distance to obstacles.
```blocks
stembot.setup()
basic.forever(function () {
    basic.showString("" + (stembot.ping(SBPingUnit.MicroSeconds)))
})
```

## Read light sensor

Light sensors can be read using the lightSensor(...) function. With this block you can specify LEFT or RIGHT.
```blocks
stembot.setup()
basic.forever(function () {
    basic.showString("" + (stembot.lightSensor(SBLdr.Left)))
    basic.pause(100)
    basic.showString("" + (stembot.lightSensor(SBLdr.Right)))
    basic.pause(100)
})
```

## Read line sensor

The Bot has two line-sensors: left and right. To read the value of the sensors, use readLine(...), With this block you can specify LEFT or RIGHT.
```blocks
stembot.setup()
basic.forever(function () {
    basic.showString("" + (stembot.readLine(SBIRSensor.Left)))
    basic.showString("" + (stembot.readLine(SBIRSensor.Left)))
})

```

## Digital Read Block

Use digitalRead(...) function to read digital signal from pin no. Sv5 or Sv6.
* Select PinMode as Input for reading the digital sensor.
```blocks
stembot.setup()
basic.forever(function () {
    basic.showString("" + (stembot.digitalRead(SBPin.Sv5)))
    basic.showString("" + (stembot.digitalRead(SBPin.Sv6)))
})
```

## Digital Write Block

Use digitalWrite(...) function to digital write for on/off any output module from pin no Sv5 and Sv6.
* Select PinMode as Output for writing the output digital signal.
```blocks
stembot.setup()
basic.forever(function () {
    stembot.digitalWrite(SBPin.Sv5, 1)
    stembot.digitalWrite(SBPin.Sv6, 0)
})
```

## Supported targets

* for PXT/microbit

## License
MIT





