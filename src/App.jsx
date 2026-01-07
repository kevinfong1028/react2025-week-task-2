import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const apiBase = import.meta.env.VITE_API_BASE;
    const apiPath = "kevin-react";
    const [formData, setFormData] = useState({
        username: "sbdrumer1028@gmail.com",
        password: "kv12345",
    });
    const [isAuth, setIsAuth] = useState(false);
    const [products, setProducts] = useState([]);
    const [isChecking, setIsChecking] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const doInputChange = (e) => {
        const { name, value } = e.target;
        // console.log(name, value);
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const submitForm = async (e) => {
        e.preventDefault();
        // console.log("submitForm", e);
        const url = `${apiBase}/admin/signin`;
        // console.log(url);
        try {
            const res = await axios.post(url, formData);
            // console.log(res);
            const { token, expired } = res.data;
            document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
            setIsAuth(true);
        } catch (error) {
            console.dir(error);
            setIsAuth(false);
        }
    };

    const checkLogin = async () => {
        console.log("checkLogin", document.cookie.split("; "));
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("hexToken="))
            ?.split("=")[1];

        axios.defaults.headers.common["Authorization"] = token;
        try {
            const url = `${apiBase}/api/user/check`;
            const res = await axios.post(url);
            console.log("checkLogin", res);
            res.data.success;
            setIsChecking(true);
            if (res.data.success) {
                setIsChecked(true);
                getProducts();
            } else {
                setIsChecked(false);
            }
        } catch (error) {
            console.dir(error);
            setIsChecked(false);
        } finally {
            setTimeout(() => {
                setIsChecking(false);
            }, 2500);
        }
    };

    const [chosenProduct, setChosenProduct] = useState(null);

    const getProducts = async () => {
        const url = `${apiBase}/api/${apiPath}/products/all`;
        try {
            const res = await axios.get(url);
            console.log("getProducts", res);
            if (res.data.success) {
                setProducts(res.data.products);
            }
        } catch (error) {
            console.dir(error);
        }
    };

    // useEffect(() => {
    //     fetchData("/data.json").then((res) => {
    //         setProducts(res);
    //     });
    // }, []);
    // console.log("products", products);

    const showDetail = (id) => {
        const matchProduct = products.find((item) => item.id === id);
        setChosenProduct(matchProduct);
        console.log("chosenProduct", matchProduct);
    };

    return (
        <div className="container">
            {!isAuth ? (
                <div className="row">
                    <h1>Login</h1>
                    <form
                        className="border p-4 bg-light rounded col-6 offset-3"
                        onSubmit={submitForm}
                    >
                        <div className="mb-3 text-start">
                            <label htmlFor="username" className="form-label">
                                Username
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="username"
                                name="username"
                                aria-describedby="emailHelp"
                                value={formData.username}
                                onChange={(e) => doInputChange(e)}
                            />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={(e) => doInputChange(e)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Sign In
                        </button>
                    </form>
                </div>
            ) : (
                <div className="container">
                    <div className="row border">
                        <div className="col-12 pt-3">
                            <p>
                                Check if the user is logged in; if so, continue
                                downloading the product list.{" "}
                            </p>
                            <button className="mb-3" onClick={checkLogin}>
                                Check
                            </button>
                            <div
                                className={`alert alert-success alert-dismissible fade ${
                                    isChecking && isChecked ? "show" : ""
                                }`}
                                role="alert"
                            >
                                logged in successfully~
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="alert"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div
                                className={`alert alert-warning alert-dismissible fade ${
                                    isChecking && !isChecked ? "show" : ""
                                }`}
                                role="alert"
                            >
                                <strong>sorry bro</strong>, you need to leave
                                this holy land, 88~
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="alert"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <hr />
                        </div>
                        <div className="col-lg-6">
                            <h2>Items on Shelf</h2>
                            <table className="table table-responsive table-striped">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Price</th>
                                        <th>Sale</th>
                                        <th>Active</th>
                                        <th>Detail</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p) => (
                                        <tr key={p.id}>
                                            <td>{p.category}</td>
                                            <td>{p.origin_price}</td>
                                            <td>{p.price}</td>
                                            <td>
                                                {p.is_enabled ? "yes" : "no"}
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() =>
                                                        showDetail(p.id)
                                                    }
                                                >
                                                    show
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="col-lg-6">
                            <h2>Item Detail</h2>
                            {chosenProduct ? (
                                <div className="card mb-3">
                                    <p className="h3 fw-bold">
                                        {chosenProduct.title}
                                    </p>
                                    <img
                                        src={chosenProduct.imageUrl}
                                        className="card-img-top mx-auto"
                                        style={{ width: "300px" }}
                                        alt="picture"
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            <span className="fs-3">
                                                Roast:
                                                {chosenProduct.category}
                                            </span>
                                            <p className="card-text text-success">
                                                {chosenProduct.content}
                                            </p>
                                        </h5>
                                        <p className="card-text">
                                            {chosenProduct.description}
                                        </p>
                                        <p className="card-text text-decoration-line-through text-secondary">
                                            Original Price：
                                            {chosenProduct.origin_price}{" "}
                                            {chosenProduct.unit}
                                        </p>
                                        <p className="card-text text-primary fs-3 fw-bold">
                                            Price：{chosenProduct.price}{" "}
                                            {chosenProduct.unit}
                                        </p>
                                        <h5>more photos...</h5>
                                        <div className="d-flex justify-content-center border border-3 overflow-auto">
                                            {chosenProduct.imagesUrl.map(
                                                (url, index) => (
                                                    <img
                                                        key={index}
                                                        src={url}
                                                        style={{
                                                            height: "100px",
                                                            objectFit: "cover",
                                                        }}
                                                        className="img-thumbnail"
                                                        alt="other-picture"
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <h3 className="container">
                                    <i className="bi bi-hand-index-thumb rotate-unclockwise-90"></i>
                                    <span className="ms-3 ps-4">
                                        please select the item on the left
                                        first.
                                    </span>
                                </h3>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
