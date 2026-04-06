import {FC} from "react"

interface BlogProps {
  // Here are the component properties
  notes: {
    id: string
    name: string
    summary?: string
    is_archive?: boolean
  }[]
}

// Generate a component based on the file name
const Blog: FC<BlogProps> = ({notes}) => {
  const allNotes = notes
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      {allNotes.map((note, index) => {
        return (
          <div key={note.id} className="mb-4 p-4 bg-white rounded-lg shadow-sm">
            <ul className="list-disc list-inside">
              <li className="text-lg font-bold text-gray-800">
                Article Name: {note.name}
              </li>
              <li className="text-gray-600">Summary: {note.summary}</li>
              <li className="text-gray-600">
                Archived: {note.is_archive ? "Yes" : "No"}
              </li>
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export default Blog
