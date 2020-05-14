import { Container } from "react-bootstrap";
import { buttonActive, themeBlack } from '../theme'

export default ({ children }) => (
  <Container>
    {children}
    <style jsx global>{`
      * {
        font-family: Lato, Menlo, Monaco, 'Lucida Console', 'Liberation Mono',
          'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Courier New',
          monospace, serif;
      }
      body {

        margin: 0;
      }
      a {
        color:${themeBlack};
      }

      a:hover {
        color:#b6509e;
        text-decoration:none;
      }

      p {
        font-size: 14px;
        line-height: 24px;
      }
      article {
        margin: 0 auto;
        max-width: 650px;
      }
      button {
        align-items: center;
        background-color: ${buttonActive};
        border: 0;
        color: white;
        display: flex;
        padding: 5px 7px;
        transition: background-color 0.3s;
      }
      button:active {
        background-color: #283352;
      }
      button:disabled {
        background-color: #b5bebf;
      }
      button:focus {
        outline: none;
      }

      .dropdown-toggle:after {
        color:black;
      }

      h1 {
        padding-top:20px;
        padding-bottom:20px;
        text-decoration:underline;
      }

      h2 {
        padding-top:20px;
        padding-bottom:20px;
        font-size:18px;
      }

      input {
        border:solid 2px whitesmoke;
      }

      input:focus {
        border:solid 2px ${themeBlack}
      }


    `}</style>
  </Container>
)
