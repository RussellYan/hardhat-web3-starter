const main = async () => {
  const Counter = await hre.ethers.getContractFactory('Counter')
  const counter = await Counter.deploy()
  await counter.deployed()
  console.log(`Contract deployed at ${counter.address}`)

  let counts = await counter.getCounts()
  console.log(`Current counts (1): ${counts}`)

  await counter.add()
  counts = await counter.getCounts()
  console.log(`Current counts (1): ${counts}`)

  await counter.add()
  counts = await counter.getCounts()
  console.log(`Current counts (1): ${counts}`)
}

main()
  .then(() => {
    console.log('success.')
    process.exit(0)
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })
