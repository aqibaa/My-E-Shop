// "use client"

// import { CldUploadWidget } from 'next-cloudinary'
// import { ImagePlus, Trash } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import Image from 'next/image'
// import { useEffect, useState } from 'react'

// export default function ImageUpload({ value = [], onChange, onRemove, maxFiles = 5, onAdd }) {
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   if (!isMounted) return null;

//   const onUpload = (result) => {
//     if (result.event === 'success') {
//       const newUrl = result.info.secure_url;
//       onAdd(newUrl);
//     }
//   }

//   const safeValue = Array.isArray(value) ? value : (value ? [value] : []);


//   return (
//     <div className="mb-4">
//       <div className="mb-4 flex flex-wrap gap-4">
//         {safeValue.map((url, index) => (
//           <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden border">
//             <Image fill className="object-cover" alt="Product image" src={url} />
//             <div className="absolute top-1 right-1 z-10">
//               <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon-sm" className="h-6 w-6">
//                 <Trash className="h-3 w-3" />
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>
//       {safeValue.length < maxFiles && (
//         <CldUploadWidget onUpload={onUpload}
//           uploadPreset="ml_default"
//           options={{
//             multiple: maxFiles > 1,
//             maxFiles: maxFiles
//           }}>
//           {({ open }) => {
//             return (
//               <Button
//                 type="button"
//                 variant="secondary"
//                 onClick={(e) => {
//                   e.preventDefault()
//                   open()
//                 }}
//                 className="border-dashed border-2"
//               >
//                 <ImagePlus className="h-4 w-4 mr-2 text-gray-500" />
//                 <span className="text-gray-600">Upload Image(s)</span>

//               </Button>
//             )
//           }}
//         </CldUploadWidget >
//       )}
//     </div>
//   )
// }

"use client"
import { useEffect, useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { ImagePlus, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'


function restoreScroll() {
  document.body.style.overflow = '';
  document.body.style.pointerEvents = '';
  document.body.style.paddingRight = '';
}


export default function ImageUpload({ value = [], onAdd, onRemove, maxFiles = 5 }) {
  const [isMounted, setIsMounted] = useState(false);


  useEffect(() => {
    setIsMounted(true);
    return () => restoreScroll();
  }, []);


  // useEffect(() => {
  //   const unlockScroll = () => {
  //     document.body.style.overflow = 'auto';
  //     document.body.style.pointerEvents = 'auto';
  //     document.body.style.paddingRight = '0px';
  //   };

  //   unlockScroll();
  //   return () => unlockScroll();
  // });

  if (!isMounted) return null;

  const safeValue = Array.isArray(value) ? value : (value ? [value] : []);

  // const onUpload = (result) => {
  //   if (result.event === 'success') {
  //     const newUrl = result.info.secure_url;
  //     onAdd(newUrl); 
  //   }
  // }

  return (
    <div className="mb-4">
      <div className="mb-4 flex flex-wrap gap-4">
        {safeValue.map((url, index) => (
          <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden border bg-gray-50">
            <Image src={url} alt="Uploaded Image" fill className="object-cover" />
            <div className="absolute top-1 right-1 z-10">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon-sm"
                className="h-7 w-7 rounded-full shadow-sm"
              >
                <Trash className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {safeValue.length < maxFiles && (
        <CldUploadWidget

          uploadPreset="ml_default"
          options={{
            multiple: maxFiles > 1,
            maxFiles: maxFiles
          }}
          onSuccess={(result) => {
            if (result.event === 'success') {
              const newUrl = result.info.secure_url;
              onAdd(newUrl);
            }
          }}
          onClose={() => {
            restoreScroll();
          }}
          onQueuesEnd={(result, { widget }) => {
            // ✅ fires when all uploads finish
            widget.close();
            restoreScroll();
          }}

        >
          {({ open }) => {
            return (
              <Button
                type="button"
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  open();
                }}
                className="border-dashed border-2 bg-gray-50 hover:bg-gray-100"
              >
                <ImagePlus className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-600">Upload Image(s)</span>
              </Button>
            )
          }}
        </CldUploadWidget>
      )}
    </div>
  )
}



// "use client"

// import { CldUploadWidget } from 'next-cloudinary'
// import { ImagePlus, Trash } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import Image from 'next/image'

// export default function ImageUpload({ value = [], onAdd, onRemove, maxFiles = 5 }) {
//   const safeValue = Array.isArray(value) ? value : (value ? [value] : []);

//   return (
//     <div className="mb-4">
//       <div className="mb-4 flex flex-wrap gap-4">
//         {safeValue.map((url, index) => (
//           <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden border bg-gray-50">
//             <Image src={url} alt="Uploaded Image" fill className="object-cover" />
//             <div className="absolute top-1 right-1 z-10">
//               <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon-sm" className="h-7 w-7 rounded-full shadow-sm">
//                 <Trash className="h-3 w-3" />
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {safeValue.length < maxFiles && (
//         <CldUploadWidget
//           uploadPreset="ml_default"
//           options={{ multiple: maxFiles > 1, maxFiles: maxFiles }}
//           onSuccess={(result) => {
//             if (result.event === 'success') {
//               onAdd(result.info.secure_url);
//             }
//           }}
//         >
//           {({ open }) => (
//             <Button type="button" variant="secondary" onClick={(e) => { e.preventDefault(); open(); }} className="border-dashed border-2 bg-gray-50 hover:bg-gray-100">
//               <ImagePlus className="h-4 w-4 mr-2 text-gray-500" />
//               <span className="text-gray-600">Upload Image(s)</span>
//             </Button>
//           )}
//         </CldUploadWidget>
//       )}
//     </div>
//   )
// }