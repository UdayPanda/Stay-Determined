
import { useAuth } from "../../contexts";

function Profile() {
  const { user } = useAuth();

  const getInitials = (name) => {
    const words = name.split(" ");
    const initials = words.map((word) => word.charAt(0).toUpperCase());
    return initials.join("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-200 flex items-center justify-center px-4 py-8">
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg p-8 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Sidebar */}
        <div className="flex flex-col items-center text-center md:border-r md:pr-6 border-white/30">
          {user.image || user?.user?.image ? (
            <img
              src={user.image ?? user.user.image}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-white"
            />
          ) : (
            <div className="w-32 h-32 rounded-full flex items-center justify-center bg-indigo-400 text-white text-3xl font-semibold shadow-md border-4 border-white">
              {getInitials(user.name ?? user?.user?.name)}
            </div>
          )}
          <h2 className="text-xl font-bold mt-4">
            {user.name ?? user.user.name}
          </h2>
          <p className="text-sm text-gray-600">
            {user.email ?? user.user.email}
          </p>
          <button className="mt-6 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition">
            Edit Profile
          </button>
        </div>

        {/* Profile Details */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">About</h3>
          <p className="text-gray-600 text-sm">{user.bio}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div>
              <h4 className="font-medium text-gray-600">Full Name</h4>
              <p className="text-gray-800">{user.name ?? user.user.name}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-600">Email</h4>
              <p className="text-gray-800">{user.email ?? user.user.email}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-600">Joined</h4>
              <p className="text-gray-800">
                {new Date(user.createdAt ?? user.user.createdAt).toDateString()}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-600">Role</h4>
              <p className="text-gray-800">Frontend Developer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
