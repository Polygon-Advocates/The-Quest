const hre = require("hardhat");

const Operators = {
  NOOP: 0, // No operation, skip query verification in circuit
  EQ: 1, // equal
  LT: 2, // less than
  GT: 3, // greater than
  IN: 4, // in
  NIN: 5, // not in
  NE: 6, // not equal
};

async function main() {
  // you can run https://go.dev/play/p/rnrRbxXTRY6 to get schema hash and claimPathKey using YOUR schema
  const schemaBigInt = "267831521922558027206082390043321796944";

  // merklized path to field in the W3C credential according to JSONLD  schema e.g. birthday in the KYCAgeCredential under the url "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld"
  const schemaClaimPathKey =
    "20376033832371109177683048456014525905119173674985843915445634726167450989630";

  const requestId = 1;

  const query = {
    schema: schemaBigInt,
    claimPathKey: schemaClaimPathKey,
    operator: Operators.EQ, // operator
    value: [13092003, ...new Array(63).fill(0).map((i) => 0)], // for operators 1-3 only first value matters
  };

  // add the address of the contract just deployed
  const zkNFTAGEMINTAddress = "0x9ee2E54cFad55C7995ae3599B756D0CcfE320933";

  let zkNFTAGEMINT = await hre.ethers.getContractAt(
    "zkNFTAGEMINT",
    zkNFTAGEMINTAddress
  );

  const validatorAddress = "0xF2D4Eeb4d455fb673104902282Ce68B9ce4Ac450"; // sig validator
  //const validatorAddress = "0x3DcAe4c8d94359D31e4C89D7F2b944859408C618"; // mtp validator

  try {
    await zkNFTAGEMINT.setZKPRequest(
      requestId,
      validatorAddress,
      query.schema,
      query.claimPathKey,
      query.operator,
      query.value
    );
    console.log("Request set");
  } catch (e) {
    console.log("error: ", e);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
