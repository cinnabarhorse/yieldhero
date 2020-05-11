import Layout from '../components/Layout'
import Header from '../components/Header'

const AboutPage = () => (
  <Layout>
    <article>
      <h1>About Yield Hero</h1>
      <p>
        The main idea of Yield Hero is to let you easily swap collateral between different aTokens to get the best yield.
      </p>


      <p>
        Yield Hero is powered by a Balancer pool. You can view details <a href={`${process.env.BALANCER_POOLS_URL}/#/pool/${process.env.POOL_ADDRESS}`}>here.</a>
      </p>



    </article>
  </Layout>
)

export default AboutPage
