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
                }
            ]
        };
    }

    getScreenWidth() {
        return window.screen.width;
    }

    getScreenHeight() {
        return window.screen.height;
    }

    getRefreshRate() {
        // This is a placeholder as JS doesn't provide a direct way to get refresh rate
        return 60; // Assuming a common refresh rate
    }

    getBatteryPercentage() {
        return navigator.getBattery().then(battery => {
            return battery.level * 100;
        });
    }
}

Scratch.extensions.register(new SystemInfo());
