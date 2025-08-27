import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import { useDeleteUserMutation, useGetUsersQuery } from "../../slices/usersApiSlice"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"


function UserListScreen() {
  
    const {data:users, refetch, isLoading, error} = useGetUsersQuery();
    console.log(users)
    const [deleteUser] = useDeleteUserMutation();

    const deleteHandler = async (id) => {
       if(window.confirm("Are you sure you want to delete")) {
        try {
            await deleteUser(id)
            refetch()
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
       }
    }
  
    return (
    <div className="container mx-auto p-5">
       <h1 className="text-2xl font-bold mb-6">Users</h1>
       {
         isLoading ? (<Loader />) : error ? (<Message>{error?.data?.message || error.error}</Message>) : (
            <div className="overflow-x-auto">
               <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-50">
                       <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text- uppercase tracking-wider">
                              ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                              NAME
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                              EMAIL
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                              ADMIN
                        </th>
                        
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                              ACTIONS
                        </th>
                     </tr>
                  </thead>
                    <tbody className="divide-y divide-gray-200">
                        {
                            users.map((user) => (
                              <tr key={user._id}>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user._id}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                   {user.name}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 hover:text-blue-700">
                                    <a href={`mailto:${user.email}`}>{user.email}</a>
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                   {user.isAdmin ? (<FaCheck className="text-green-500" />) : (<FaTimes className="text-red-500" />)}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {
                                        !user.isAdmin && (
                                            <div className="flex space-x-2">
                                                <Link 
                                                  to={`/admin/user/${user._id}/edit`}
                                                  className="text-primary hover:text-secondary"
                                                >
                                                    <FaEdit size={20} />
                                                </Link>
                                                <button onClick={() => deleteHandler(user._id)}>
                                                    <FaTrash size={20} className="text-red-500 hover:text-red-700" />

                                                </button>
                                            </div>
                                        )
                                    }
                                 </td>
                              </tr>
                            ))
                        }
                    </tbody>
               </table>
            </div>
         )
       }
    </div>
  )
}

export default UserListScreen
