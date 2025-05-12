import Navbar from "./navbar"
import Footer from "./footer"
const Layout = ({ children }) => {
    return (
        <>
          <Navbar />
          <main  className="pt-20 flex-1 bg-black p-4">
          <div  >{children}</div>
          </main>
          <Footer />
        </>
      )
  }
  
  export default Layout