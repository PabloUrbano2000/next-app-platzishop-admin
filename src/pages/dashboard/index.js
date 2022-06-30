import React from 'react';
import { useFetch } from '@hooks/useFetch';
import { Chart } from '@common/Chart';
import services from '@services/api';
import Paginate from '@components/Pagination';
import { XCircleIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { deleteProduct } from '@services/api/products';
import { useAlert } from '@hooks/useAlert';

const PRODUCT_LIMIT = 10;

export default function Dashboard() {
  const [offsetProducts, setOffsetProducts] = React.useState(0);
  const { data: products } = useFetch(services.products.getProducts(PRODUCT_LIMIT, offsetProducts));
  const { data: totalProducts } = useFetch(services.products.getProducts(0, 0));
  const { setAlert } = useAlert();

  const categoryNames = totalProducts?.map((product) => product.category);
  const categoryCount = categoryNames?.map((category) => category.name);

  const countOcurrences = (arr) =>
    arr.reduce((prev, curr) => ((prev[curr] = ++prev[curr] || 1), prev), {});

  const data = {
    datasets: [
      {
        label: 'Categories',
        data: countOcurrences(categoryCount),
        borderWidth: 2,
        backgroundColor: ['#ffbb11', '#c0c0c0', '#50af95', '#f3ba2f', '#2a71d0'],
      },
    ],
  };

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
      <Chart className="mb-8 mt-2" chartData={data}></Chart>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              {totalProducts.length > 0 && (
                <Paginate
                  totalItems={totalProducts.length}
                  itemsPerPage={PRODUCT_LIMIT}
                  setOffset={setOffsetProducts}
                  neighbours={3}
                ></Paginate>
              )}
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
    </>
  );
}
