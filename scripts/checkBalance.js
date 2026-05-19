const { ethers } = require("hardhat");

async function main() {
    const address = "0xbb8F70b628a1C2083fDC55a718bA0E8073ff7856";
    console.log(`Checking Base Sepolia balance for ${address}...`);
    
    // Poll every 10 seconds
    while (true) {
        const balance = await ethers.provider.getBalance(address);
        const ethBalance = ethers.formatEther(balance);
        
        if (parseFloat(ethBalance) > 0) {
            console.log(`\n🎉 SUCCESS! Balance arrived: ${ethBalance} ETH on Base Sepolia!`);
            console.log(`Ready to deploy.`);
            process.exit(0);
        }
        
        process.stdout.write(".");
        await new Promise(resolve => setTimeout(resolve, 10000));
    }
}

main().catch(console.error);
