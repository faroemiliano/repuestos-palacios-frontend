// import CategoriesSection from "../../components/home/CategoriasSeccion";
import ContactCTA from "../../components/home/Contact";
import Hero from "../../components/home/Hero";
import FeaturedProducts from "../../components/home/Products";
import SEO from "../../components/seo/SEO";

function Home() {
  return (
    <>
      <SEO
        title="Repuestos y accesorios para vehículos"
        description="Encontrá repuestos y accesorios para vehículos. Consultá nuestro catálogo, marcas disponibles y contactanos para encontrar el repuesto que necesitás."
      />
      <Hero />
      {/* <CategoriesSection /> */}
      <FeaturedProducts />
      <ContactCTA />
    </>
  );
}

export default Home;
