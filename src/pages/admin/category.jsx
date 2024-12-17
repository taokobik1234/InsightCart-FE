import { useEffect, useState } from "react"
import Dialog from "../../components/ui/Dialog"
import { useSelector } from "react-redux"
const formFeilds = [
    {name: "name", placeholder: "Name", type: "INPUT"},
    {name: "description", placeholder: "Description", type: "TEXTAREA"}
]
export default function Category() {
    const {user} = useSelector(state => state.auth)
    const [isOpenDialog, setIsOpenDialog] = useState({
        isOpen: false,
        mode: 'add' | 'edit'
    })
    const [categoryData, setCategoryData] = useState({
        name: '',
        description: ''
    })
    const [categoryList, setCategoryList] = useState([])
    const [errors, setErrors] = useState({
        isMissingName: false,
        isMissingDescription: false
    })
    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!categoryData.name) {
            setErrors({...errors, isMissingName: true})
            return
        }
        if(!categoryData.description) {
            setErrors({...errors, isMissingDescription: true})
            return
        }
        setErrors({...errors, isMissingName: false, isMissingDescription: false})
        try {
            const response = await fetch('http://tancatest.me/api/v1/admin/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'session-id': user.session_id,
                    'Authorization': `Bearer ${user.token.AccessToken}`,
                    'x-client-id': user.id
                },
                body: JSON.stringify({
                    name: categoryData.name,
                    description: categoryData.description
                })
            }).then(response => response.json())
            setIsOpenDialog({isOpen: false})
            setCategoryData({
                name: '',
                description: ''
            })
            setCategoryList([...categoryList, response.data])
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://tancatest.me/api/v1/admin', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'session-id': user.session_id,
                        'Authorization': `Bearer ${user.token.AccessToken}`,
                        'x-client-id': user.id
                    }
                }).then(response => response.json())
                setCategoryList(response.data.categories)
            } catch (error) {
                console.log(error);
            }
        }
        fetchCategories()
    }, [])
    return (
        <div className="w-full p-10 flex flex-col gap-10">
          <div className="flex flex-row items-center gap-3">
            <h1 className="text-3xl font-semibold">Category</h1>
            <button 
                className="bg-sky-500 text-white rounded-lg hover:bg-sky-300 p-3"
                onClick={() => setIsOpenDialog({isOpen: true, mode: 'add'})}
            >
                Add New Category
            </button>
            <Dialog open={isOpenDialog.isOpen} onClose={() => setIsOpenDialog({isOpen: false})}>
                <form
                    onSubmit={handleSubmit}
                >
                    <h1 className="text-xl font-semibold">{isOpenDialog.mode === 'add' ? 'Add New Category' : 'Edit Category'}</h1>
                    <div className="flex flex-col gap-3">
                        {formFeilds.map((item, index) => (
                            <div key={index} className="flex flex-col gap-2">
                                <label>{item.placeholder}</label>
                                {item.type === 'INPUT' && 
                                <input 
                                    className="border border-gray-300 rounded-md p-2"
                                    name={item.name}
                                    value={categoryData[item.name]}
                                    onChange={(e) => setCategoryData({...categoryData, [e.target.name]: e.target.value})}
                                />
                                }
                                {item.type === 'TEXTAREA' && 
                                <textarea 
                                    className="border border-gray-300 rounded-md p-2 resize-none"
                                    rows={5}
                                    name={item.name}
                                    value={categoryData[item.name]}
                                    onChange={(e) => setCategoryData({...categoryData, [e.target.name]: e.target.value})}
                                />
                                }
                                {errors.isMissingName && item.name === 'name' && <span className="text-red-500">Name is required</span>}
                                {errors.isMissingDescription && item.name === 'description' && <span className="text-red-500">Description is required</span>}
                            </div>
                        ))}
                        <button 
                            type="submit"
                            className="bg-sky-500 text-white rounded-lg hover:bg-sky-300 p-3"
                        >
                            {isOpenDialog.mode === 'add' ? 'Add' : 'Edit'}
                        </button>
                    </div>
                </form>
            </Dialog>
          </div>
          {categoryList.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                  {categoryList.map((item, index) => (
                      <div key={index} className="flex flex-row items-center bg-slate-200 p-3 rounded-lg">
                          <h1 className="text-xl font-semibold">{item.name}</h1>
                      </div>
                  ))}
              </div>
          )}
        </div>
      )
}
