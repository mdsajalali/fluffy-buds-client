import HeadingTitle from "../shared/HeadingTitle";
import Container from "../shared/Container";
import ProductCard from "../shared/ProductCard";
import { Product } from "../hooks/useCategoriesProduct";
import ProductCardSkeleton from "./(skeleton)/ProductCardSkeleton";

// Define props type for clarity
interface ToysProps {
  products: Product[];
  loading: boolean;
}

const Toys = ({ products, loading }: ToysProps) => {
  const skeletonCount = 8;

  return (
    <>
      <HeadingTitle title="Toys" />
      <Container>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 text-lg">
            No toys found.
          </div>
        )}
      </Container>
    </>
  );
};

export default Toys;
