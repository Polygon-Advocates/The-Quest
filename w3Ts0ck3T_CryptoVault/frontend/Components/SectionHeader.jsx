const SectionHeader = () => {
  return (
    <div className="flex p-4 border gap-4 justify-between items-center">
      <p>Vault ID</p>
      <p>Withdrawer Address</p>
      <p>Amount : ETH</p>
      <p>Tokens Loaned : VLTK</p>
      <p>Unlock TimeStamp : sec</p>
      <p>Action</p>
    </div>
  );
};

export default SectionHeader;
