import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, getDocs, query, where, orderBy, limit, startAfter }
    from 'firebase/firestore';

import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem  from '../components/ListingItem'

function Category() {

    const [listings, setListings] = useState(null);

    const [loading, setLoading] = useState(true);

     const [lastFetchedListing, setLastFetchedListing] = useState(null);
    // const params = useParams();

    useEffect(() => { 
        const fetchListings = async () => {
            try {
                //  Get Reference

                const listingsRef = collection(db, 'listings')
                
                // Create a query 
                const q = query(listingsRef, where('offer', '==', true),
                    orderBy('timestamp', 'desc'), limit(3));
                

                //  Execute the query

                const querySnap = await getDocs(q);

                const lastVisible = querySnap.docs[querySnap.docs.length - 1];
                setLastFetchedListing(lastVisible);

                const listings = [];

                querySnap.forEach((doc) => {
                    console.log(doc.data());
                    listings.push({
                        id: doc.id,
                        data:doc.data()
                    });
                })

                setListings(listings);
                setLoading(false)
            } catch (e) {
                toast.error('Could not fetch listings');
            }
        }

        fetchListings();
    }, []);

    const onMoreFetchListing = async () => {
        try {
            //  Get Reference

            const listingsRef = collection(db, 'listings')
                
            // Create a query 
            const q = query(listingsRef, where('offer', '==', true),
                orderBy('timestamp', 'desc'),
                startAfter(lastFetchedListing),
                limit(3));
                

            //  Execute the query

            const querySnap = await getDocs(q);

            const lastVisible = querySnap.docs[querySnap.docs.length - 1];
            console.log(lastVisible);
            setLastFetchedListing(lastVisible);

            const listings = [];

            querySnap.forEach((doc) => {
                console.log(doc.data());
                listings.push({
                    id: doc.id,
                    data: doc.data()
                });
            })

            setListings((prevState)=>[...prevState,...listings]);
            setLoading(false)
        } catch (e) {
            toast.error('Could not fetch listings');
        }
    }



  return (
      <div className="category">
          <header>
              <p className="pageHeader">
                  Offers
              </p>
          </header>

          {loading ? <Spinner /> : listings && listings.length > 0 ?
              <>
                  <main>
                      <ul className="categoryListings">
                          {listings.map((listing) => (
                              <ListingItem listing={listing.data} id={listing.id} key={listing.id} />
                          ))}
                      </ul>
                  </main>
                  
                  {lastFetchedListing && (
                      <p className="loadMore" onClick={onMoreFetchListing}>Load More</p>
                  )}
          </>
              : <p>No listings</p>}
    </div>
  )
}

export default Category