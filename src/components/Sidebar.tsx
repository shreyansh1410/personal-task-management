import Link from "next/link"

const Sidebar = () => {
  return (
    <nav className="w-64 bg-gray-800 text-white p-4">
      <ul>
        <li className="mb-2">
          <Link href="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
        </li>
        <li className="mb-2">
          <Link href="/dashboard/tasks" className="hover:text-gray-300">
            Tasks
          </Link>
        </li>
        <li className="mb-2">
          <Link href="/dashboard/projects" className="hover:text-gray-300">
            Projects
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Sidebar

