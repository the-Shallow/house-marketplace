import { getAuth ,updateProfile} from "firebase/auth"
import { useState , useEffect } from "react"
import { Link , useNavigate } from "react-router-dom";
import { db } from "../firebase.config";
import { doc, updateDoc , collection , getDocs , query , where , orderBy , deleteDoc, limit } from "firebase/firestore";
import { toast } from "react-toastify";
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";


function Profile() {

    const auth = getAuth();
    const [changeDetails, setChangeDetails] = useState(false);
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email:auth.currentUser.email
    });

    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);

    const { name, email } = formData;

    const navigate = useNavigate();

    
    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, 'listings');

            const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'), limit(5));

            const querySnap = await getDocs(q);

            let listings = [];

            querySnap.forEach((doc) => {
                listings.push({
                    id: doc.id,
                    data:doc.data()
                })
            })

            setListings(listings);
            setLoading(false);
        }

        fetchUserListings();
    },[auth.currentUser.uid])

    const onLogout = () => {
        auth.signOut();
        navigate('/');
    }

    const onDelete = async (listingId) => {
        if (window.confirm("Are you sure you want to delete?")) {
            await deleteDoc(doc(db, 'listings', listingId));
            const updatedListings = listings.filter((listing) => {
                return listing.id !== listingId
            })

            setListings(updatedListings);
            toast.success("Sucessfullt deleted listing");
        }
    }

    const onEdit = (listingId) => {
        navigate(`/edit-listing/${listingId}`);
    }

    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                // Update display name in fb
                await updateProfile(auth.currentUser, {
                    displayName:name
                })

                // Update in firestore
                const userRef = doc(db, 'users', auth.currentUser.uid);

                await updateDoc(userRef, {
                    name
                })
            }
        } catch (e) {
            toast.error('Error updating profile');
        }
    }

    const onChange = (e) => {
        setFormData((prevState) => {
            return {
                ...prevState,
                [e.target.id]: e.target.value,
            }
        })
    }

    return loading ? <Spinner /> : (<div className="profile">
            <header className="profileHeader">
                <p className="pageHeader">My Profile</p>
                <button className="logOut" onClick={onLogout}>
                        LogOut
                </button>
            </header>

            <main>
                <div className="profileDetailsHeader">
                    <p className="profileDetailsText">Personal Details</p>
                    <p className="changePersonalDetails" onClick={() => {
                        changeDetails && onSubmit();
                        setChangeDetails((prevState) => !prevState);
                    }}>
                        {changeDetails ? 'done':'change'}
                    </p>
                </div>

                <div className="profileCard">
                    <input type="text" id='name'
                        className={!changeDetails ? 'profileName' : 'profileNameActive'}
                        disabled={!changeDetails}
                        value={name}
                        onChange={onChange}
                    />

                    <input type="text" id='email'
                        className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
                        disabled={!changeDetails}
                        value={email}
                        onChange={onChange}
                    />
                </div>

                <Link to={'/create-listing'} className='createListing' >
                    <img src={homeIcon} alt="" />
                    <p>Sell or rent your home</p>
                    <img src={arrowRight} alt="" />
            </Link>
            
            {listings?.length > 0 && (
                <>
                    <p className="listingText">Your Listings</p>
                    <ul className="listingList">
                        {listings.map((listing) => {
                            return <ListingItem id={listing.id} key={listing.id} listing={listing.data}
                                onDelete={() => onDelete(listing.id)}
                                onEdit={ ()=>onEdit(listing.id) }/>
                        })}
                    </ul>
                </>
            )}
            </main>
        </div>
    )
}

export default Profile