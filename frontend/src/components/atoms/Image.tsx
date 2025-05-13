import axios from 'axios';
import React from 'react';

namespace Image {
  export type Props = Omit<React.ComponentProps<'img'>, 'src'> & Required<Pick<React.ComponentProps<'img'>, 'src'>>;
}

function Image({src, alt = '', className, ...props}: Image.Props) {
  const [blobUrl, setBlobUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState(false);
  const currentBlobRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    axios
      .get(src, {responseType: 'blob', withCredentials: true})
      .then(response => {
        if (isMounted) {
          const newBlobUrl = URL.createObjectURL(response.data);
          if (currentBlobRef.current) {
            URL.revokeObjectURL(currentBlobRef.current);
          }
          currentBlobRef.current = newBlobUrl;
          setBlobUrl(newBlobUrl);
        }
      })
      .catch(() => isMounted && setError(true));

    return () => {
      isMounted = false;
      if (currentBlobRef.current) {
        URL.revokeObjectURL(currentBlobRef.current);
        currentBlobRef.current = null;
      }
    };
  }, [src]);

  if (error || !blobUrl) {
    return <img {...props} alt={alt} className={className} />;
  }

  return <img src={blobUrl} alt={alt} className={className} {...props} />;
}

export default Image;
