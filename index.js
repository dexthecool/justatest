class SystemInfo {
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
            if ('AmbientLightSensor' in window) {
                const sensor = new AmbientLightSensor();
                sensor.addEventListener('reading', () => {
                    resolve(sensor.illuminance);
                });
                sensor.addEventListener('error', reject);
                sensor.start();
            } else {
                reject('AmbientLightSensor not supported');
            }
        });
    }

    getGyro(args) {
        return new Promise((resolve, reject) => {
            if ('Gyroscope' in window) {
                const sensor = new Gyroscope();
                sensor.addEventListener('reading', () => {
                    if (args.AXIS === 'x') {
                        resolve(sensor.x);
                    } else if (args.AXIS === 'y') {
                        resolve(sensor.y);
                    } else if (args.AXIS === 'z') {
                        resolve(sensor.z);
                    }
                });
                sensor.addEventListener('error', reject);
                sensor.start();
            } else {
                reject('Gyroscope not supported');
            }
        });
    }

    getAccelerometer(args) {
        return new Promise((resolve, reject) => {
            if ('Accelerometer' in window) {
                const sensor = new Accelerometer();
                sensor.addEventListener('reading', () => {
                    if (args.AXIS === 'x') {
                        resolve(sensor.x);
                    } else if (args.AXIS === 'y') {
                        resolve(sensor.y);
                    } else if (args.AXIS === 'z') {
                        resolve(sensor.z);
                    }
                });
                sensor.addEventListener('error', reject);
                sensor.start();
            } else {
                reject('Accelerometer not supported');
            }
        });
    }

    getTemperature() {
        return new Promise((resolve, reject) => {
            if ('TemperatureSensor' in window) {
                const sensor = new TemperatureSensor();
                sensor.addEventListener('reading', () => {
                    resolve(sensor.temperature);
                });
                sensor.addEventListener('error', reject);
                sensor.start();
            } else {
                reject('TemperatureSensor not supported');
            }
        });
    }

    getPressure() {
        return new Promise((resolve, reject) => {
            if ('PressureSensor' in window) {
                const sensor = new PressureSensor();
                sensor.addEventListener('reading', () => {
                    resolve(sensor.pressure);
                });
                sensor.addEventListener('error', reject);
                sensor.start();
            } else {
                reject('PressureSensor not supported');
            }
        });
    }
}

Scratch.extensions.register(new SystemInfo());
