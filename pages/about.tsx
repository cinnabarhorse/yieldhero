import Layout from '../components/Layout'

const AboutPage = () => (
  <Layout>
    <article>
      <h1>About Yield Hero</h1>
      <p>
        The main idea of Yield Hero is to let you easily swap collateral between different aTokens to get the best yield.
      </p>


      <p>
        Yield Hero is powered by a Balancer pool. You can view details <a href={`https://${process.env.BALANCER_POOLS_URL}/${process.env.POOL_ADDRESS}`}>here.</a>
      </p>



    </article>
  </Layout>
)

export default AboutPage
