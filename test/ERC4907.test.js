const ERC4907 = artifacts.require("ERC4907");

contract("ERC4907", (accounts) => {
    let erc4907;

    before(async () => {
        erc4907 = await ERC4907.new();
    });

    it("should set user for a token", async () => {
        const tokenId = 1;
        const user = accounts[1];
        const expires = Math.floor(Date.now() / 1000) + 3600; // expires in 1 hour
        await erc4907.safeMint(accounts[0], tokenId);
        await erc4907.setUser(tokenId, user, expires, { from: accounts[0] });
        const userOf = await erc4907.userOf(tokenId);
        const userExpires = await erc4907.userExpires(tokenId);

        assert.equal(userOf, user, "User was not set correctly");
        assert.equal(userExpires, expires, "User expires was not set correctly");
    });

    it("should not set user for a token if not approved or owner", async () => {
        const tokenId = 2;
        const user = accounts[2];
        const expires = Math.floor(Date.now() / 1000) + 3600; // expires in 1 hour
        await erc4907.safeMint(accounts[0], tokenId);
        try {
            await erc4907.setUser(tokenId, user, expires, { from: accounts[1] });
        } catch (error) {
            if (error.reason) {
                assert.equal(error.reason, "ERC721: transfer caller is not owner nor approved", "Error: VM Exception while processing transaction: revert ERC721: transfer caller is not owner nor approved");
            } else {
                assert.equal(error.toString(), "ERC721: transfer caller is not owner nor approved", "Error: VM Exception while processing transaction: revert ERC721: transfer caller is not owner nor approved");
            }

        }
    });
});
