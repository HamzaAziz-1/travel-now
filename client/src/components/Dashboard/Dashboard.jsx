import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
  { name: "Reports", href: "#", current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard() {
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-8 w-8"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        alt="Your Company"
                      />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                            style={{ textDecoration: "none" }}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <button
                        type="button"
                        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <img
                              className="h-8 w-8 rounded-full"
                              src={user.imageUrl}
                              alt=""
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                    style={{ textDecoration: "none" }}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.imageUrl}
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">
                        {user.name}
                      </div>
                      <div className="text-sm font-medium leading-none text-gray-400">
                        {user.email}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {/* Your content */}
            <div className="">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Id
              officiis labore numquam explicabo dolorem eos ipsa quam, libero
              sequi necessitatibus magni alias et dolor eum veritatis esse
              voluptas recusandae ipsum eveniet ut neque praesentium quaerat.
              Sequi repellendus totam reprehenderit excepturi. Accusamus commodi
              perferendis ullam vero autem. Tenetur, quas ducimus enim fugiat
              quo natus, asperiores voluptatum minus veritatis maiores earum.
              Numquam, ipsa tenetur. Ea, ad odit nisi repellendus temporibus
              voluptate quaerat eveniet aliquid ex voluptatum quod accusamus eum
              tenetur nihil corporis est optio non voluptas beatae harum veniam
              excepturi quisquam. Pariatur repudiandae aliquid dolor! Voluptate,
              natus pariatur quos quod explicabo vitae dolor, fugiat officia
              mollitia inventore quaerat dolore incidunt ea maiores placeat?
              Deserunt corporis porro nihil ratione consequuntur consectetur,
              cumque obcaecati modi reprehenderit et maxime voluptate non ullam,
              facere voluptatibus voluptatum illo rem natus. Reiciendis unde
              itaque esse, assumenda voluptate quo harum, temporibus adipisci
              illum earum sed modi distinctio! Quisquam eligendi repellendus
              amet libero ducimus, possimus incidunt molestiae, blanditiis
              magnam aut voluptates sint quam rerum earum omnis natus aspernatur
              id alias ipsam laboriosam consequuntur? Provident consectetur
              debitis excepturi consequatur deleniti magni aliquam, voluptas
              recusandae, quae, fuga quidem sequi error reprehenderit dolorem
              doloremque quaerat id laudantium perspiciatis? Atque voluptatem
              consequuntur, quos consequatur neque, doloremque necessitatibus
              dignissimos labore in saepe unde ducimus accusantium fugit, ipsam
              aliquam voluptas. Dolore, doloremque! Incidunt voluptatibus harum
              obcaecati, voluptatem, nihil praesentium, culpa reprehenderit
              distinctio placeat architecto corrupti veniam. Quibusdam impedit
              minima laudantium corporis ea, aliquam modi, vitae doloribus
              aspernatur unde nulla explicabo voluptas voluptates deserunt quam
              libero aperiam dolores et asperiores. Sapiente animi vitae,
              officia nulla ipsam tenetur pariatur? Maxime cum similique labore
              blanditiis sed. Expedita ea dolor labore aut illum quas animi,
              perspiciatis veritatis! Ab, incidunt quo? Eaque earum, ex
              laboriosam esse perferendis dolor autem. Repudiandae illum
              accusamus esse eos pariatur ipsam eius debitis nemo iste aperiam
              ea quam quod vero repellendus, quae architecto ad recusandae
              soluta consectetur eum facere dignissimos quos ratione voluptatum!
              Neque nihil soluta id facilis reprehenderit, fugiat aperiam
              necessitatibus quia voluptatum. Sunt optio explicabo blanditiis
              error aliquid odit natus ipsum minima, eos, laboriosam libero
              neque ullam sit aut, consequatur dolorem maiores. Voluptatibus
              consequatur ratione deserunt corrupti porro at cumque earum
              distinctio mollitia dicta amet vitae aliquid, nisi, alias impedit?
              Aperiam temporibus hic et ex reiciendis nesciunt, fuga totam quam!
              Inventore quae cum optio quis expedita illo, tempora iusto,
              temporibus soluta, dicta accusamus libero aliquid voluptatem.
              Exercitationem, amet corporis. Natus mollitia placeat earum
              praesentium suscipit reprehenderit et, totam, repellat in ad sunt
              enim alias! Hic mollitia doloribus repudiandae dolor? Vel optio ut
              culpa ipsam eaque minus, autem fuga? Facere, numquam alias,
              delectus quis, omnis recusandae dolorum deleniti mollitia officia
              architecto asperiores et quaerat atque assumenda tempore odio
              doloremque quas animi voluptatibus saepe ipsum ipsa. Perspiciatis
              soluta suscipit architecto. Reprehenderit eligendi ipsam tempore
              molestiae recusandae voluptatibus aperiam eaque, minima aspernatur
              labore quibusdam sequi hic cumque pariatur delectus voluptatum,
              impedit eius similique. Laborum beatae soluta perspiciatis sed
              veritatis, accusamus voluptates vitae debitis exercitationem dolor
              minima quis aut, libero ea necessitatibus id, dignissimos
              perferendis reprehenderit quia dolorum!
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
