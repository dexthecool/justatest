class SystemInfo {
    constructor() {
        this.ambientLightSensor = null;
        this.gyroscope = null;
        this.accelerometer = null;
        this.temperatureSensor = null;
        this.pressureSensor = null;
        this.initSensors();
    }

    initSensors() {
        // Initialize Ambient Light Sensor
        if ('AmbientLightSensor' in window) {
            try {
                this.ambientLightSensor = new AmbientLightSensor();
                this.ambientLightSensor.start();
            } catch (error) {
                console.error('AmbientLightSensor initialization failed:', error);
            }
        } else {
            console.warn('AmbientLightSensor not supported on this device.');
        }

        // Initialize Gyroscope
        if ('Gyroscope' in window) {
            try {
                this.gyroscope = new Gyroscope({frequency: 60});
                this.gyroscope.start();
            } catch (error) {
                console.error('Gyroscope initialization failed:', error);
            }
        } else {
            console.warn('Gyroscope not supported on this device.');
        }

        // Initialize Accelerometer
        if ('Accelerometer' in window) {
            try {
                this.accelerometer = new Accelerometer({frequency: 60});
                this.accelerometer.start();
            } catch (error) {
                console.error('Accelerometer initialization failed:', error);
            }
        } else {
            console.warn('Accelerometer not supported on this device.');
        }

        // Initialize Temperature Sensor
        if ('TemperatureSensor' in window) {
            try {
                this.temperatureSensor = new TemperatureSensor();
                this.temperatureSensor.start();
            } catch (error) {
                console.error('TemperatureSensor initialization failed:', error);
            }
        } else {
            console.warn('TemperatureSensor not supported on this device.');
        }

        // Initialize Pressure Sensor
        if ('PressureSensor' in window) {
            try {
                this.pressureSensor = new PressureSensor();
                this.pressureSensor.start();
            } catch (error) {
                console.error('PressureSensor initialization failed:', error);
            }
        } else {
            console.warn('PressureSensor not supported on this device.');
        }
    }

    getInfo() {
        return {
            id: 'systemInfo',
            name: 'System Info',
            blocks: [
                {
                    opcode: 'getScreenWidth',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'screen width'
                },
                {
                    opcode: 'getScreenHeight',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'screen height'
                },
                {
                    opcode: 'getRefreshRate',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'refresh rate'
                },
                {
                    opcode: 'getBatteryPercentage',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'battery percentage'
                },
                {
                    opcode: 'getAmbientLight',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'ambient light'
                },
                {
                    opcode: 'getGyro',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'gyroscope [AXIS]',
                    arguments: {
                        AXIS: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'axisMenu'
                        }
                    }
                },
                {
                    opcode: 'getAccelerometer',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'accelerometer [AXIS]',
                    arguments: {
                        AXIS: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'axisMenu'
                        }
                    }
                },
                {
                    opcode: 'getTemperature',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'temperature'
                },
                {
                    opcode: 'getPressure',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'pressure'
                }
            ],
            menus: {
                axisMenu: {
                    acceptReporters: true,
                    items: ['x', 'y', 'z']
                }
            }
        };
    }

    getScreenWidth() {
        return window.screen.width;
    }

    getScreenHeight() {
        return window.screen.height;
    }

    getRefreshRate() {
        return new Promise((resolve) => {
            let frameCount = 0;
            const start = performance.now();

            function countFrames(now) {
                frameCount++;
                if (now - start < 1000) {
                    requestAnimationFrame(countFrames);
                } else {
                    resolve(Math.round((frameCount / (now - start)) * 1000));
                }
            }

            requestAnimationFrame(countFrames);
        });
    }

    getBatteryPercentage() {
        return new Promise((resolve, reject) => {
            navigator.getBattery().then(battery => {
                resolve(Math.round(battery.level * 100));
            }).catch(err => {
                reject(err);
            });
        });
    }

    getAmbientLight() {
        return new Promise((resolve, reject) => {
            if (this.ambientLightSensor) {
                const handleReading = () => resolve(this.ambientLightSensor.illuminance);
                this.ambientLightSensor.addEventListener('reading', handleReading, { once: true });
                this.ambientLightSensor.addEventListener('error', reject, { once: true });
            } else {
                reject('AmbientLightSensor not supported');
            }
        });
    }

    getGyro(args) {
        return new Promise((resolve, reject) => {
            if (this.gyroscope) {
                const handleReading = () => {
                    if (args.AXIS === 'x') {
                        resolve(this.gyroscope.x);
                    } else if (args.AXIS === 'y') {
                        resolve(this.gyroscope.y);
                    } else if (args.AXIS === 'z') {
                        resolve(this.gyroscope.z);
                    }
                };
                this.gyroscope.addEventListener('reading', handleReading, { once: true });
                this.gyroscope.addEventListener('error', reject, { once: true });
            } else {
                reject('Gyroscope not supported');
            }
        });
    }

    getAccelerometer(args) {
        return new Promise((resolve, reject) => {
            if (this.accelerometer) {
                const handleReading = () => {
                    if (args.AXIS === 'x') {
                        resolve(this.accelerometer.x);
                    } else if (args.AXIS === 'y') {
                        resolve(this.accelerometer.y);
                    } else if (args.AXIS === 'z') {
                        resolve(this.accelerometer.z);
                    }
                };
                this.accelerometer.addEventListener('reading', handleReading, { once: true });
                this.accelerometer.addEventListener('error', reject, { once: true });
            } else {
                reject('Accelerometer not supported');
            }
        });
    }

    getTemperature() {
        return new Promise((resolve, reject) => {
            if (this.temperatureSensor) {
                const handleReading = () => resolve(this.temperatureSensor.temperature);
                this.temperatureSensor.addEventListener('reading', handleReading, { once: true });
                this.temperatureSensor.addEventListener('error', reject, { once: true });
            } else {
                reject('TemperatureSensor not supported');
            }
        });
    }

    getPressure() {
        return new Promise((resolve, reject) => {
            if (this.pressureSensor) {
                const handleReading = () => resolve(this.pressureSensor.pressure);
                this.pressureSensor.addEventListener('reading', handleReading, { once: true });
                this.pressureSensor.addEventListener('error', reject, { once: true });
            } else {
                reject('PressureSensor not supported');
            }
        });
    }
}

Scratch.extensions.register(new SystemInfo());
