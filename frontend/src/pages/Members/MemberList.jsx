import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Dialog, Transition } from "@headlessui/react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import api from "../../pages/api";

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/members");
      setMembers(response.data);
    } catch (error) {
      console.error(error);
      // You might want to add a toast notification here
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/members/${id}`);
      setIsDeleteModalOpen(false);
      setMemberToDelete(null);
      fetchMembers();
    } catch (error) {
      console.error(error);
      // You might want to add a toast notification here
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => `${row.first_name} ${row.last_name}`,
        id: "name",
        header: "Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "gender",
        header: "Gender",
        cell: (info) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              info.getValue() === "male"
                ? "bg-blue-100 text-blue-800"
                : "bg-pink-100 text-pink-800"
            }`}
          >
            {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
          </span>
        ),
      },
      {
        accessorKey: "marital_status",
        header: "Marital Status",
        cell: (info) => {
          const status = info.getValue();
          const colors = {
            married: "bg-green-100 text-green-800",
            single: "bg-blue-100 text-blue-800",
            divorced: "bg-orange-100 text-orange-800",
          };
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                colors[status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          );
        },
      },
      {
        accessorKey: "membership_date",
        header: "Membership Date",
        cell: (info) =>
          info.getValue()
            ? new Date(info.getValue()).toLocaleDateString()
            : "N/A",
      },
      {
        accessorKey: "is_active",
        header: "Status",
        cell: (info) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              info.getValue()
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {info.getValue() ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/members/edit/${info.row.original.id}`)}
              className="inline-flex cursor-pointer items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PencilSquareIcon className="h-4 w-4 mr-1" />
              Edit
            </button>
            <button
              onClick={() => {
                setMemberToDelete(info.row.original);
                setIsDeleteModalOpen(true);
              }}
              className="inline-flex cursor-pointer items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        ),
      },
    ],
    [navigate]
  );

  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: searchText,
    },
    onGlobalFilterChange: setSearchText,
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 pt-18">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-poppins font-bold text-gray-900">
            Members
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all members in your church including their name, gender,
            marital status, and membership date.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => navigate("/members/new")}
            className="inline-flex cursor-pointer items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Member
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="relative rounded-md shadow-sm mb-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-0"
            placeholder="Search members..."
          />
        </div>

        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : "",
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: (
                                  <ChevronUpIcon className="h-4 w-4 inline" />
                                ),
                                desc: (
                                  <ChevronDownIcon className="h-4 w-4 inline" />
                                ),
                              }[header.column.getIsSorted()] ?? null}
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Transition.Root show={isDeleteModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={setIsDeleteModalOpen}
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <TrashIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Delete Member
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete{" "}
                          {memberToDelete
                            ? `${memberToDelete.first_name} ${memberToDelete.last_name}`
                            : "this member"}
                          ? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={() => handleDelete(memberToDelete?.id)}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default MemberList;
