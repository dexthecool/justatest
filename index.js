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
        if ('AmbientLightSensor' in window) {
            this.ambientLightSensor = new AmbientLightSensor();
            this.ambientLightSensor.start();
        }

        if ('Gyroscope' in window) {
            this.gyroscope = new Gyroscope({frequency: 60});
            this.gyroscope.start();
        }

        if ('Accelerometer' in window) {
            this.accelerometer = new Accelerometer({frequency: 60});
            this.accelerometer.start();
        }

        if ('TemperatureSensor' in window) {
            this.temperatureSensor = new TemperatureSensor();
            this.temperatureSensor.start();
        }

        if ('PressureSensor' in window) {
            this.pressureSensor = new PressureSensor();
            this.pressureSensor.start();
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
                this.ambientLightSensor.addEventListener('reading', () => {
                    resolve(this.ambientLightSensor.illuminance);
                });
                this.ambientLightSensor.addEventListener('error', reject);
            } else {
                reject('AmbientLightSensor not supported');
            }
        });
    }

    getGyro(args) {
        return new Promise((resolve, reject) => {
            if (this.gyroscope) {
                this.gyroscope.addEventListener('reading', () => {
                    if (args.AXIS === 'x') {
                        resolve(this.gyroscope.x);
                    } else if (args.AXIS === 'y') {
                        resolve(this.gyroscope.y);
                    } else if (args.AXIS === 'z') {
                        resolve(this.gyroscope.z);
                    }
                });
                this.gyroscope.addEventListener('error', reject);
            } else {
                reject('Gyroscope not supported');
            }
        });
    }

    getAccelerometer(args) {
        return new Promise((resolve, reject) => {
            if (this.accelerometer) {
                this.accelerometer.addEventListener('reading', () => {
                    if (args.AXIS === 'x') {
                        resolve(this.accelerometer.x);
                    } else if (args.AXIS === 'y') {
                        resolve(this.accelerometer.y);
                    } else if (args.AXIS === 'z') {
                        resolve(this.accelerometer.z);
                    }
                });
                this.accelerometer.addEventListener('error', reject);
            } else {
                reject('Accelerometer not supported');
            }
        });
    }

    getTemperature() {
        return new Promise((resolve, reject) => {
            if (this.temperatureSensor) {
                this.temperatureSensor.addEventListener('reading', () => {
                    resolve(this.temperatureSensor.temperature);
                });
                this.temperatureSensor.addEventListener('error', reject);
            } else {
                reject('TemperatureSensor not supported');
            }
        });
    }

    getPressure() {
        return new Promise((resolve, reject) => {
            if (this.pressureSensor) {
                this.pressureSensor.addEventListener('reading', () => {
                    resolve(this.pressureSensor.pressure);
                });
                this.pressureSensor.addEventListener('error', reject);
            } else {
                reject('PressureSensor not supported');
            }
        });
    }
}

Scratch.extensions.register(new SystemInfo());
