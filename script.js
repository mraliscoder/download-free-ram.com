function detectOS() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('win') !== -1) {
        return 'windows';
    } else if (userAgent.indexOf('linux') !== -1 || userAgent.indexOf('x11') !== -1) {
        return 'linux';
    } else if (userAgent.indexOf('mac') !== -1) {
        return 'macos';
    }
    return 'unknown';
}

function downloadRAM() {
    const ramSize = parseInt(document.getElementById('ramSize').value);
    const output = document.getElementById('output');

    if (!ramSize || ramSize < 1) {
        alert('Please enter a valid amount of RAM (at least 1GB)');
        return;
    }

    const os = detectOS();

    if (os === 'windows') {
        showWindowsError(ramSize);
    } else {
        showLinuxCommands(ramSize);
    }

    output.classList.add('show');
    output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showWindowsError(ramSize) {
    const output = document.getElementById('output');
    output.innerHTML = `
        <div class="error-block">
            <div class="error-title">ERROR: INCOMPATIBLE OPERATING SYSTEM</div>
            <p><strong>Error Code:</strong> 0xDEADBEEF</p>
            <p style="margin-top: 1rem;">Unfortunately, Windows does not support downloading RAM.</p>
            <p style="margin-top: 0.5rem;">Microsoft has disabled this feature to force users to buy overpriced RAM modules.</p>
            <p style="margin-top: 1.5rem;"><strong>Requested Allocation:</strong> ${ramSize}GB</p>
            <p style="margin-top: 0.5rem;"><strong>Status:</strong> FAILED</p>
            <p style="margin-top: 1.5rem; color: #ababab;">Try switching to Linux to unlock the free RAM download feature!</p>
            <button onclick="showLinuxCommandsAnyway(${ramSize})" style="margin-top: 1.5rem; background: #0a0a0a; border: 1px solid #2a2a2a; color: #d1d5db;">I still want to continue</button>
        </div>
    `;
}

function showLinuxCommandsAnyway(ramSize) {
    showLinuxCommands(ramSize);
}

function showLinuxCommands(ramSize) {
    const output = document.getElementById('output');
    const commands = `sudo mkdir -p /var/cache/swap/
sudo dd if=/dev/zero of=/var/cache/swap/swap${ramSize} bs=1G count=${ramSize}
sudo chmod 0600 /var/cache/swap/swap${ramSize}
sudo mkswap /var/cache/swap/swap${ramSize}
sudo swapon /var/cache/swap/swap${ramSize}
echo "/var/cache/swap/swap${ramSize} none swap sw 0 0" | sudo tee -a /etc/fstab`;

    output.innerHTML = `
        <div class="output-header">
            <div class="output-title">Your download is ready!</div>
            <button class="copy-btn" onclick="copyCommands()">Copy</button>
        </div>
        <div class="command-block" id="commandBlock">${commands}</div>
        <p style="margin-top: 1.5rem; color: #9ca3af; font-size: 0.875rem;">
            Execute the above commands in your Linux terminal to download ${ramSize}GB of virtual memory for FREE!
            Root privileges required.
        </p>
    `;
}

function copyCommands() {
    const commandBlock = document.getElementById('commandBlock');
    const text = commandBlock.textContent;

    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');

        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        alert('Failed to copy: ' + err);
    });
}

// Allow Enter key to submit
document.getElementById('ramSize').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        downloadRAM();
    }
});
