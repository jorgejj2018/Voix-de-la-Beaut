import Navbar from './Navbar'
import Footer from './Footer'

export default function PageLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5E6E0]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
