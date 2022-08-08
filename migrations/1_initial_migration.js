const Migrations = artifacts.require("Migrations");
const OnlyToken = artifacts.require("OnlyToken");
const OnlySubscription = artifacts.require("OnlySubscription");

module.exports = async function(deployer) {
  await deployer.deploy(Migrations);
  await deployer.deploy(OnlyToken);
  await deployer.deploy(OnlySubscription);
  const onlySubscription = await OnlySubscription.deployed()
  const onlyToken = await OnlyToken.deployed()
  // Mint 1,000 Dai Tokens for the deployer
  await onlyToken.mint(
    '0x9E4d0239de29709C231e54Ec2326E736b6580718',
    '1000000000000000000000'
  )
};
