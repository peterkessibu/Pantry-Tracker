// Import the Image component from next/image
import Image from 'next/image';

const MyComponent = () => {
  return (
    <div>
      {/* Use the Image component and specify the src, width, and height */}
      <Image
        src=".\\public\\create-a-flat-vector-illustrative-style-wordmark-l-_C8gRDi1RimeFVnvfvh1xQ-EUWsbkEmT8awWFHVc87Fcg.jpeg" // Path to your image file in the public directory
        alt="Description of the image"
        width={20} // Specify the width of the image
        height={20} // Specify the height of the image
      />
    </div>
  );
};

export default MyComponent;
