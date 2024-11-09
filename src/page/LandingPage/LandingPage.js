import React, { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container, Spinner, Form } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";

const LandingPage = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product.productList);
  const [query] = useSearchParams();
  const name = query.get("name");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc"); // 기본값 내림차순

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
  }, [query, sortOrder]);

  const sortedProductList = [...productList].sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <Form.Select
            aria-label="정렬 순서 선택"
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">최신순</option>
            <option value="asc">오래된 순</option>
          </Form.Select>
        </Col>
      </Row>
      <Row>
        {loading ? (
          <div className="text-align-center">
            <Spinner animation="border" />
          </div>
        ) : sortedProductList.length > 0 ? (
          sortedProductList.map((item) => (
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
