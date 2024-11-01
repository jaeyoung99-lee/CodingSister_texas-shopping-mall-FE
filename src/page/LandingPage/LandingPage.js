import React, { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container, Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";

const LandingPage = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product.productList);
  const [query] = useSearchParams();
  const name = query.get("name");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(
        getProductList({
          name,
        })
      );
      setLoading(false);
    };

    fetchData();
  }, [query]);

  return (
    <Container>
      <Row>
        {loading ? (
          <div className="text-align-center">
            <Spinner animation="border" />
          </div>
        ) : productList.length > 0 ? (
          productList.map((item) => (
            <Col md={3} sm={12} key={item._id}>
              <ProductCard item={item} />
            </Col>
          ))
        ) : (
          <div className="text-align-center empty-bag">
            {name === "" ? (
              <h2>등록된 상품이 없습니다!</h2>
            ) : (
              <h2>{name}과 일치한 상품이 없습니다!`</h2>
            )}
          </div>
        )}
      </Row>
    </Container>
  );
};

export default LandingPage;
