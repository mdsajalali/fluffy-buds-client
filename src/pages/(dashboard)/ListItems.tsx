import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import Pagination from "../../components/Pagination";
import useProducts from "../../hooks/useProducts";
import axiosInstance from "../../lib/axiosInstance";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { ProductProps } from "../../types/types";

const ListItems: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const { products, loading, totalPages, setProducts } = useProducts(
    currentPage,
    {}
  );

  // Show delete confirmation modal
  const handleDeleteClick = (id: string, name: string) => {
    setProductToDelete({ id, name });
    setShowModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        const response = await axiosInstance.delete(
          `/delete-product/${productToDelete.id}`
        );
        toast.success(response?.data?.message);
        setProducts((prevProducts: ProductProps[]) =>
          prevProducts.filter(
            (product: ProductProps) => product._id !== productToDelete.id
          )
        );
        setShowModal(false);
        setProductToDelete(null);
      } catch (error) {
        console.error("Failed to delete product", error);
        toast.error("Failed to delete product. Please try again.");
        setShowModal(false);
        setProductToDelete(null);
      }
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowModal(false);
    setProductToDelete(null);
  };

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 md:py-10">
      <h2 className="text-2xl font-bold mb-6">Product List</h2>

      <div className="overflow-x-auto w-full">
        <table className="w-full bg-white border border-gray-200 rounded-xl shadow-sm text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr className="text-left">
              <th className="px-5 py-4 font-semibold">Image</th>
              <th className="px-5 py-4 font-semibold">Name</th>
              <th className="px-5 py-4 font-semibold">Description</th>
              <th className="px-5 py-4 font-semibold">Category</th>
              <th className="px-5 py-4 font-semibold">Price</th>
              <th className="px-5 py-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-md" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 w-40 bg-gray-200 rounded" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 w-16 bg-gray-200 rounded" />
                    </td> 
                    <td className="px-5 py-4">
                      <div className="h-4 w-20 bg-gray-200 rounded" />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="h-4 w-16 bg-gray-200 mx-auto rounded" />
                    </td>
                  </tr>
                ))
              : products.map((item: ProductProps) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-all"
                  >
                    <td className="px-5 py-4">
                      {item.images.length > 0 && (
                        <img
                          src={item.images[0].url}
                          alt={item.name}
                          className="w-16 h-16 rounded-md object-cover border"
                        />
                      )}
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {item.name}
                    </td>
                    <td className="px-5 py-4 truncate text-gray-600 max-w-xs">
                      {item.description}
                    </td>
                    <td className="px-5 py-4 text-gray-700">{item.category}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                        <span className="text-base font-bold text-gray-900">
                          ${item.price}
                        </span>
                        {item.price < item.regularPrice && (
                          <span className="text-xs line-through text-gray-400">
                            ${item.regularPrice}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex justify-center gap-4">
                        <Link
                          to={`${item._id}`}
                          className="text-blue-600 cursor-pointer hover:text-blue-800 transition flex items-center gap-1"
                        >
                          <Pencil size={18} />
                          <span className="hidden sm:inline">Edit</span>
                        </Link>

                        <button
                          onClick={() => handleDeleteClick(item._id, item.name)}
                          className="text-red-600 cursor-pointer hover:text-red-800 transition flex items-center gap-1"
                        >
                          <Trash2 size={18} />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={showModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page: number) => setCurrentPage(page)}
      />
    </div>
  );
};

export default ListItems;
