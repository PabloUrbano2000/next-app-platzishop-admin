import React from 'react';
// import Paginate from '@components/Pagination';
import axios from 'axios';
import { PlusIcon } from '@heroicons/react/solid';
import Modal from '@common/Modal';
import FormProduct from '@components/FormProduct';
import endPoints from '@services/api';
import Alert from '@common/Alert';
import { useAlert } from '@hooks/useAlert';
import { deleteProduct } from '@services/api/products';
import { XCircleIcon } from '@heroicons/react/outline';
import Link from 'next/link';

export default function Products() {
  const [products, setProducts] = React.useState([]);
  // const [totalProducts, setTotalProducts] = React.useState([]);

  const [open, setOpen] = React.useState(false);

  const { alert, setAlert, toggleAlert } = useAlert();

  React.useEffect(() => {
    async function getProducts() {
      const response = await axios.get(endPoints.products.getAllProducts);
      setProducts(response.data);
    }
    try {
      getProducts();
    } catch (error) {
      console.log(error);
    }
  }, [alert]);

  const handleDelete = (id) => {
    deleteProduct(id)
      .then(() => {
        setAlert({
          active: true,
          message: 'Delete product successfully',
          type: 'error',
          autoClose: true,
        });
      })
      .catch(() => {
        setAlert({
          active: true,
          message: 'Ocurred a error',
          type: 'error',
          autoClose: true,
        });
      });
  };

  return (
    <>
      <Alert alert={alert} handleClose={toggleAlert} />
      <div className="lg:flex lg:items-center lg:justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            List of Products
          </h2>
        </div>
        <div className="mt-5 flex lg:mt-0 lg:ml-4">
          <span className="sm:ml-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setOpen(true)}
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5 text-white" aria-hidden="true" />
              Add Product
            </button>
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              {/* {totalProducts.length > 0 && (
                <Paginate
                  totalItems={totalProducts.length}
                  itemsPerPage={PRODUCT_LIMIT}
                  setOffset={setOffsetProducts}
                  neighbours={3}
                ></Paginate>
              )} */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      Edit
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.length > 0 ? (
                    <>
                      {products?.map((product) => (
                        <tr key={`Product-item-${product?.id}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={product?.images[0]}
                                  alt=""
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product?.name}
                                </div>
                                <div className="text-sm text-gray-500">{product?.title}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product?.category?.name}</div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product?.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              href={`/dashboard/edit/${product?.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <XCircleIcon
                              className="flex-shrik-0 h-6 w-6 text-gray-400 cursor-pointer"
                              onClick={() => handleDelete(product.id)}
                            />
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal open={open} setOpen={setOpen}>
        <FormProduct setOpen={setOpen} setAlert={setAlert} />
      </Modal>
    </>
  );
}
