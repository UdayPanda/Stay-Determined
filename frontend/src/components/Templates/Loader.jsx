import LoadingImage from '../../assets/image.png'

function Loader() {
  return (
    <>
    <div className="fixed inset-0 flex items-center justify-center bg-[#1919198e] bg-opacity-70 backdrop-blur-sm z-50">
      <img
        src={LoadingImage} 
        alt="Loading"
        className="w-48 animate-pulse rounded-xl bg-cover bg-center"
      />
    </div>
    </>
    
  )

}

export default Loader
