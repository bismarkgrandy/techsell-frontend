

import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../lib/axios.js';

function AdminPage() {
  const [activePage, setActivePage] = useState('Delivery Personnel');
  const [pendingProducts, setPendingProducts] = useState([]);
  const [barterItems, setBarterItems] = useState([]);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [approvedPersonnel, setApprovedPersonnel] = useState([]);
  const [pendingPersonnel, setPendingPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data based on active page
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (activePage === 'Products') {
          const response = await axiosInstance.get("/admin/products/pending");
          setPendingProducts(response.data.products);
        } else if (activePage === 'Barter') {
          const response = await axiosInstance.get("/barter");
          setBarterItems(response.data);
        } else if (activePage === 'Sellers Hub') {
          const response = await axiosInstance.get("/admin/pending-seller");
          setPendingSellers(response.data.sellers);
        } else if (activePage === 'Delivery Personnel') {
          const approvedResponse = await axiosInstance.get("/admin/approved-delivery-personnel");
          const pendingResponse = await axiosInstance.get("/admin/pending-delivery-personnel");
          setApprovedPersonnel(approvedResponse.data.deliveryPersonnel);
          setPendingPersonnel(pendingResponse.data.deliveryPersonnel);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [activePage]);

  // Handle approval for products
  const handleApproveProduct = async (id) => {
    try {
      await axiosInstance.patch(`/admin/product/${id}`, { status: "approved" });
      setPendingProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error approving product:", error);
    }
  };

  // Handle deletion for barter items
  const handleDeleteBarter = async (id) => {
    try {
      await axiosInstance.delete(`/admin/admin-delist-barter/${id}`);
      setBarterItems((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting barter item:", error);
    }
  };

  // Handle approval for sellers
  const handleApproveSeller = async (id) => {
    try {
      await axiosInstance.patch(`/admin/approve-seller/${id}`, { status: "approved" });
      setPendingSellers((prev) => prev.filter((seller) => seller._id !== id));
    } catch (error) {
      console.error("Error approving seller:", error);
    }
  };

  // Handle approval for delivery personnel
  const handleApproveDelivery = async (id) => {
    try {
      await axiosInstance.patch(`/admin/approve/delivery-personnel/${id}`, { status: "approved" });
      setPendingPersonnel((prev) => prev.filter((person) => person._id !== id));
      const response = await axiosInstance.get("/admin/approved-delivery-personnel");
      setApprovedPersonnel(response.data.deliveryPersonnel);
    } catch (error) {
      console.error("Error approving delivery personnel:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 flex-shrink-0">
        <div className="p-4 flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
            <span className="font-bold">A</span>
          </div>
          <span className="font-semibold text-lg">Admin</span>
        </div>

        <nav className="mt-8">
          <ul>
            <li>
              <button
                onClick={() => setActivePage('Delivery Personnel')}
                className={`flex items-center w-full py-3 px-4 ${activePage === 'Delivery Personnel' ? 'border-l-4 border-blue-500 bg-gray-700' : ''}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Delivery Personnel
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage('Products')}
                className={`flex items-center w-full py-3 px-4 ${activePage === 'Products' ? 'border-l-4 border-blue-500 bg-gray-700' : ''}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Products
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage('Barter')}
                className={`flex items-center w-full py-3 px-4 ${activePage === 'Barter' ? 'border-l-4 border-blue-500 bg-gray-700' : ''}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Barter
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage('Sellers Hub')}
                className={`flex items-center w-full py-3 px-4 ${activePage === 'Sellers Hub' ? 'border-l-4 border-blue-500 bg-gray-700' : ''}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Sellers
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-800">
              <span className="font-bold">A</span>
            </div>
          </div>
        </header>

        {/* Main Content based on active page */}
        {activePage === 'Delivery Personnel' && (
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold">Delivery Personnel</h1>
                <p className="text-gray-400">Manage delivery personnel accounts</p>
              </div>
            </div>

            {/* Approved Delivery Personnel */}
            <div className="mb-8 bg-gray-800 rounded-lg overflow-hidden">
              <h3 className="text-xl font-semibold p-4">Approved Delivery Personnel</h3>
              {loading ? (
                <div className="p-4 text-center">Loading...</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {approvedPersonnel.map((person) => (
                      <tr key={person._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                              <span className="font-medium text-sm">{person.username[0]}</span>
                            </div>
                            <div className="text-sm font-medium">{person.username}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{person.deliveryPhone}</td>
                      </tr>
                    ))}
                    {approvedPersonnel.length === 0 && (
                      <tr>
                        <td colSpan="2" className="px-6 py-4 text-center text-sm">No approved personnel found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pending Delivery Personnel */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <h3 className="text-xl font-semibold p-4">Pending Delivery Personnel</h3>
              {loading ? (
                <div className="p-4 text-center">Loading...</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Phone</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {pendingPersonnel.map((person) => (
                      <tr key={person._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                              <span className="font-medium text-sm">{person.username[0]}</span>
                            </div>
                            <div className="text-sm font-medium">{person.username}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{person.deliveryPhone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => handleApproveDelivery(person._id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                    {pendingPersonnel.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-6 py-4 text-center text-sm">No pending personnel found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </main>
        )}

        {activePage === 'Products' && (
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold">Pending Products</h1>
                <p className="text-gray-400">Manage pending products</p>
              </div>
            </div>

            {loading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : (
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Image</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {pendingProducts.map((product) => (
                      <tr key={product._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                              <span className="font-medium text-sm">{product.name[0]}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-md cursor-pointer"
                            onClick={() => window.open(product.image, '_blank')}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">{product.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => handleApproveProduct(product._id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                    {pendingProducts.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm">No pending products found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        )}

        {activePage === 'Barter' && (
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold">Barter Items</h1>
                <p className="text-gray-400">Manage barter items</p>
              </div>
            </div>

            {loading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : (
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Item</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Image</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {barterItems.map((item) => (
                      <tr key={item._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                              <span className="font-medium text-sm">{item.itemName[0]}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium">{item.itemName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={item.image}
                            alt={item.itemName}
                            className="w-12 h-12 rounded-md cursor-pointer"
                            onClick={() => window.open(item.image, '_blank')}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">{item.owner.username}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => handleDeleteBarter(item._id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {barterItems.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm">No barter items found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        )}

        {activePage === 'Sellers Hub' && (
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold">Pending Sellers</h1>
                <p className="text-gray-400">Manage pending sellers</p>
              </div>
            </div>

            {loading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : (
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Seller</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Store Name</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {pendingSellers.map((seller) => (
                      <tr key={seller._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                              <span className="font-medium text-sm">{seller.username[0]}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium">{seller.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">{seller.storeName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => handleApproveSeller(seller._id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                    {pendingSellers.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-6 py-4 text-center text-sm">No pending sellers found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        )}
      </div>
    </div>
  );
}

export default AdminPage;