// to interact with the contract
const myrt = artifacts.require("myrt");
const BigNumber = require("bignumber.js");
 
contract('MYRT', async accounts => {
 
  // initialise the contract instance before running tests
  let contractInstance = null;
  beforeEach(async () => {
    contractInstance = await myrt.new({from: accounts[0]});
  });

  // owner should have 50 billion myrt in their address
  it('sender should has 25 billion MYRT', async () => {
    // get balance of owner
    const balance = await contractInstance.balanceOf.call(accounts[0],{from:accounts[0]});
    assert.equal(balance, 25000000000*(10**18), "the balance is not equal to 25 billion");
   });
    
  // owner should be the contract deployer 
  it('owner address should be sender address', async () => {
    // get owner
    const owner = await contractInstance.owner.call({from:accounts[0]});
    assert.equal(owner, accounts[0], "the owner is not sender");
  });

  // owner should be able to burn myrt
  it('owner should be able to burn MYRT', async () => {
    // balance before butn
    const balanceBefore = await contractInstance.balanceOf.call(accounts[0],{from:accounts[0]});
    // burn some myrt
    await contractInstance.burn(accounts[0],  BigNumber(10000000000*(10**18)),{from: accounts[0]});
    // balance after
    const balanceAfter = await contractInstance.balanceOf.call(accounts[0],{from:accounts[0]});
    assert.equal(balanceAfter, BigNumber(balanceBefore).minus(10000000000*(10**18)).toNumber(), BigNumber(10000000000*(10**18)).toString());
  });

  // burn function triggered by other user should be failed
  it('other user should be unable to burn MYRT', async () => {
    try{
        await contractInstance.burn(accounts[0], BigNumber(10000000000*(10**18)),{from: accounts[1]});
        assert(false);
    } catch (e) {
        assert(e);
    }
  });

  // owner should be able to mint myrt
  it('owner should be able to mint MYRT', async () => {
    // mint myrt
    await contractInstance.mint(accounts[1],  BigNumber(10000000000*(10**18)),{from: accounts[0]});
    // get balance
    const balance = await contractInstance.balanceOf(accounts[1],{from:accounts[0]});
    assert.equal(balance, 10000000000*(10**18),"balance of account[1] is not correct");
  });

  // mint function triggered by other user should be failed
  it('other user should be unable to mint MYRT', async () => {
    try{
        await contractInstance.mint(accounts[2], BigNumber(10000000000*(10**18)),{from: accounts[2]});
        assert(false);
    } catch(e){
        assert(e);
    }
  });

   // owner should be able to transfer ownership to other account
   it('should be able to transfer ownership', async ()=> {
     // transfer ownership
     await contractInstance.transferOwnership(accounts[1], {from: accounts[0]});
     // get owner
     const owner = await contractInstance.owner.call({from: accounts[0]});
     assert.equal(owner, accounts[1], "the owner does not change");
   });
     
   
   // other user should not be able to transfer ownership
   it('other should not be able to transfer ownership', async ()=> {
     try{
        await contractInstance.transferOwnership(accounts[2], {from: accounts[3]});
        assert(false);
     } catch (e) {
         assert(e);
     }
   });

  // owner should be null after owner renounce ownership
  it('owner should be null afer renounce ownership', async () => {
    // renounce owner
    await contractInstance.renounceOwnership({from: accounts[0]});
    // get owner
    const owner = await contractInstance.owner.call({from: accounts[0]});
    // empty address
    zero_address = "0x0000000000000000000000000000000000000000";
    assert(owner == zero_address, "failed to remove owner");
   });
 
      // other user should not be able to renounce ownership
  it('other should not be able to renounce ownership', async () => {
    try {
         await contractInstance.renounceOwnership({from: accounts[1]});
         assert(false);
      } catch (e) {
        assert(e);
      }
   });

});