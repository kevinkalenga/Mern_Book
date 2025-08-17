import { Children } from "react"


function FormContainer({children}) {
  return (
    <div className="flex justify-center">
        <div className="w-full max-w-md px-4">
            {children}
        </div>
    </div>
  )
}

export default FormContainer
