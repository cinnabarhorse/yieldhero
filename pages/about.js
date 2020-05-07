import App from '../components/App'
import Header from '../components/Header'

const AboutPage = () => (
  <App>
    <Header />
    <article>
      <h1>About Gobbl</h1>
      <p>
        The main idea of Gobbl is to let you easily swap collateral between different aTokens to get the best yield.
      </p>


      <p>
        Gobbl is powered by a Balancer pool. You can view details <a href="https://kovan.pools.balancer.exchange/#/pool/0x7d3fd22FBC32FD112696E8e7cFc7Eb7f50c657b2">here.</a>
      </p>



    </article>
  </App>
)

export default AboutPage
