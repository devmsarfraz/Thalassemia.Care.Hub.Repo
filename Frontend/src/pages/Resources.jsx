import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Accordion, Badge, ListGroup, Button } from 'react-bootstrap';
import {
    FaBookMedical, FaHeartbeat, FaAppleAlt, FaNotesMedical,
    FaInfoCircle, FaExclamationTriangle, FaDna, FaRunning,
    FaBrain, FaQuestionCircle, FaUserMd, FaHospital
} from 'react-icons/fa';

const Resources = () => {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <Container className="py-5 mb-5">
            {/* Page Header */}
            <div className="text-center mb-5 fade-in-up">
                <Badge bg="primary" className="mb-3 px-3 py-2 rounded-pill">Medical Guide</Badge>
                <h1 className="display-4 fw-bold text-dark mb-3">Thalassemia Knowledge Base</h1>
                <p className="lead text-muted mx-auto" style={{ maxWidth: '800px', lineHeight: '1.8' }}>
                    A comprehensive educational resource for patients, families, and caregivers.
                    Sourced from the <strong>World Health Organization (WHO)</strong>, <strong>CDC</strong>, and <strong>Thalassemia International Federation (TIF)</strong>.
                </p>
            </div>

            <Tab.Container id="resources-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Row className="g-4">
                    {/* Sidebar Navigation */}
                    <Col lg={3}>
                        <Card className="border-0 shadow-sm rounded-4 sticky-top" style={{ top: '100px', zIndex: 10 }}>
                            <Card.Body className="p-3">
                                <h6 className="text-uppercase text-muted fw-bold small mb-3 px-3">Topics</h6>
                                <Nav variant="pills" className="flex-column gap-2">
                                    <Nav.Item>
                                        <Nav.Link eventKey="overview" className="d-flex align-items-center p-3 rounded-3 fw-bold">
                                            <FaInfoCircle className="me-3" /> Overview & Genetics
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="symptoms" className="d-flex align-items-center p-3 rounded-3 fw-bold">
                                            <FaExclamationTriangle className="me-3" /> Signs & Symptoms
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="treatment" className="d-flex align-items-center p-3 rounded-3 fw-bold">
                                            <FaNotesMedical className="me-3" /> Treatment & Care
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="diet" className="d-flex align-items-center p-3 rounded-3 fw-bold">
                                            <FaAppleAlt className="me-3" /> Diet & Nutrition
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="lifestyle" className="d-flex align-items-center p-3 rounded-3 fw-bold">
                                            <FaRunning className="me-3" /> Healthy Living
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="faq" className="d-flex align-items-center p-3 rounded-3 fw-bold">
                                            <FaQuestionCircle className="me-3" /> Common FAQs
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Content Area */}
                    <Col lg={9}>
                        <Tab.Content>
                            {/* OVERVIEW TAB */}
                            <Tab.Pane eventKey="overview">
                                <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                                    <div className="bg-primary p-4 p-lg-5 text-white position-relative overflow-hidden">
                                        <div className="position-relative z-1">
                                            <h2 className="display-6 fw-bold mb-3">Understanding Thalassemia</h2>
                                            <p className="lead mb-0 opacity-90">An inherited blood disorder that affects hemoglobin production.</p>
                                        </div>
                                        <FaDna size={200} className="position-absolute opacity-10" style={{ right: '-20px', bottom: '-40px' }} />
                                    </div>
                                    <Card.Body className="p-4 p-lg-5">
                                        <h4 className="fw-bold mb-4">What is it exactly?</h4>
                                        <p className="mb-4 text-secondary lh-lg">
                                            Thalassemia is a genetic blood disorder caused by <strong>mutations or deletions</strong> in the genes responsible for producing hemoglobin. Hemoglobin is the protein in red blood cells that carries oxygen from the lungs to the rest of the body. When there isn't enough hemoglobin, the body's organs don't get enough oxygen, leading to <strong>anemia</strong>.
                                        </p>

                                        <Row className="g-4 mb-5">
                                            <Col md={6}>
                                                <div className="p-4 bg-light rounded-4 h-100 border border-light">
                                                    <h5 className="fw-bold text-primary mb-3">🌍 Global Impact</h5>
                                                    <p className="small text-muted mb-0">It is one of the most common genetic disorders worldwide. Approximately <strong>5% of the global population</strong> carries a globin variant gene. It is most prevalent in Mediterranean, South Asian, Southeast Asian, and Middle Eastern regions.</p>
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div className="p-4 bg-light rounded-4 h-100 border border-light">
                                                    <h5 className="fw-bold text-success mb-3">🧬 Inheritance Pattern</h5>
                                                    <p className="small text-muted mb-0">Thalassemia is <strong>autosomal recessive</strong>. This means a child must inherit two defective genes—one from each parent—to develop the disease. If they inherit only one, they become a "Carrier" (Thalassemia Minor) and usually have no symptoms.</p>
                                                </div>
                                            </Col>
                                        </Row>

                                        <h4 className="fw-bold mb-4">Detailed Classification</h4>
                                        <Accordion defaultActiveKey="0" className="custom-accordion">
                                            <Accordion.Item eventKey="0" className="mb-3 border rounded-3 overflow-hidden">
                                                <Accordion.Header><strong>Alpha Thalassemia</strong></Accordion.Header>
                                                <Accordion.Body className="bg-light">
                                                    <p>Involves the <strong>alpha globin</strong> genes (4 genes total, 2 from each parent).</p>
                                                    <ul className="mb-0 text-secondary">
                                                        <li><strong>Silent Carrier (1 gene missing):</strong> Healthy, normal blood tests.</li>
                                                        <li><strong>Trait / Minor (2 genes missing):</strong> Mild anemia, small red blood cells.</li>
                                                        <li><strong>HbH Disease (3 genes missing):</strong> Moderate to severe anemia, bone issues, enlarged spleen.</li>
                                                        <li><strong>Alpha Thalassemia Major (4 genes missing):</strong> Very severe, usually fatal before birth (Hydrops fetalis).</li>
                                                    </ul>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                            <Accordion.Item eventKey="1" className="mb-3 border rounded-3 overflow-hidden">
                                                <Accordion.Header><strong>Beta Thalassemia</strong></Accordion.Header>
                                                <Accordion.Body className="bg-light">
                                                    <p>Involves the <strong>beta globin</strong> genes (2 genes total, 1 from each parent).</p>
                                                    <ul className="mb-0 text-secondary">
                                                        <li><strong>Trait / Minor (1 gene altered):</strong> Mild anemia, often asymptomatic.</li>
                                                        <li><strong>Intermedia (2 genes altered):</strong> Moderate anemia. Need occasional transfusions, especially during illness or pregnancy.</li>
                                                        <li><strong>Major / Cooley's Anemia (2 genes altered):</strong> Severe life-threatening anemia. Requires lifelong regular blood transfusions starting in infancy.</li>
                                                    </ul>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            {/* SYMPTOMS TAB */}
                            <Tab.Pane eventKey="symptoms">
                                <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                                    <div className="bg-warning p-4 p-lg-5 text-dark position-relative overflow-hidden">
                                        <div className="position-relative z-1">
                                            <h2 className="display-6 fw-bold mb-3">Signs & Symptoms</h2>
                                            <p className="lead mb-0 opacity-75">Recognizing the indicators early leads to better management.</p>
                                        </div>
                                        <FaExclamationTriangle size={180} className="position-absolute opacity-10" style={{ right: '-20px', bottom: '-30px' }} />
                                    </div>
                                    <Card.Body className="p-4 p-lg-5">
                                        <p className="lead text-muted mb-5">Symptoms vary greatly depending on the type of thalassemia. Carriers usually show no signs, while those with Major forms show signs within the first 2 years of life.</p>

                                        <div className="row g-4 mb-5">
                                            <div className="col-md-6">
                                                <h5 className="fw-bold mb-3 text-secondary">🩺 Common Early Signs</h5>
                                                <ListGroup variant="flush">
                                                    <ListGroup.Item className="d-flex align-items-center">
                                                        <span className="bg-warning bg-opacity-25 p-2 rounded-circle me-3">💤</span>
                                                        <div><strong>Extreme Fatigue</strong><br /><span className="small text-muted">Feeling weak or tired constantly due to low oxygen.</span></div>
                                                    </ListGroup.Item>
                                                    <ListGroup.Item className="d-flex align-items-center">
                                                        <span className="bg-warning bg-opacity-25 p-2 rounded-circle me-3">👻</span>
                                                        <div><strong>Pale Appearance</strong><br /><span className="small text-muted">Skin may look pale or yellowish (Jaundice).</span></div>
                                                    </ListGroup.Item>
                                                    <ListGroup.Item className="d-flex align-items-center">
                                                        <span className="bg-warning bg-opacity-25 p-2 rounded-circle me-3">📉</span>
                                                        <div><strong>Slow Growth</strong><br /><span className="small text-muted">Children may fail to thrive or have delayed puberty.</span></div>
                                                    </ListGroup.Item>
                                                </ListGroup>
                                            </div>
                                            <div className="col-md-6">
                                                <h5 className="fw-bold mb-3 text-secondary">⚠️ Advanced Indicators</h5>
                                                <ListGroup variant="flush">
                                                    <ListGroup.Item className="d-flex align-items-center">
                                                        <span className="bg-danger bg-opacity-10 p-2 rounded-circle me-3">🦴</span>
                                                        <div><strong>Bone Deformities</strong><br /><span className="small text-muted">Especially in the face (Cheekbones, Jaw) as bone marrow expands.</span></div>
                                                    </ListGroup.Item>
                                                    <ListGroup.Item className="d-flex align-items-center">
                                                        <span className="bg-danger bg-opacity-10 p-2 rounded-circle me-3">💧</span>
                                                        <div><strong>Dark Urine</strong><br /><span className="small text-muted">Caused by the rapid breakdown of red blood cells.</span></div>
                                                    </ListGroup.Item>
                                                    <ListGroup.Item className="d-flex align-items-center">
                                                        <span className="bg-danger bg-opacity-10 p-2 rounded-circle me-3">🥜</span>
                                                        <div><strong>Swollen Abdomen</strong><br /><span className="small text-muted">Caused by an enlarged spleen (Splenomegaly) or liver.</span></div>
                                                    </ListGroup.Item>
                                                </ListGroup>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-danger bg-opacity-10 rounded-4 border border-danger border-opacity-25">
                                            <div className="d-flex">
                                                <FaHeartbeat className="text-danger flex-shrink-0 me-3" size={30} />
                                                <div>
                                                    <h5 className="fw-bold text-danger">Medical Emergency Warning</h5>
                                                    <p className="mb-0 small text-danger text-opacity-75">
                                                        If left untreated, severe thalassemia can lead to <strong>Heart Failure</strong> and <strong>severe infection risk</strong>. Regular medical follow-up is critical.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            {/* TREATMENT TAB */}
                            <Tab.Pane eventKey="treatment">
                                <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                                    <div className="bg-success p-4 p-lg-5 text-white position-relative overflow-hidden">
                                        <div className="position-relative z-1">
                                            <h2 className="display-6 fw-bold mb-3">Treatment Protocols</h2>
                                            <p className="lead mb-0 opacity-90">Modern medicine enables patients to live long, healthy lives.</p>
                                        </div>
                                        <FaHospital size={160} className="position-absolute opacity-10" style={{ right: '-10px', bottom: '-20px' }} />
                                    </div>
                                    <Card.Body className="p-4 p-lg-5">

                                        {/* Transfusions */}
                                        <div className="mb-5">
                                            <h4 className="d-flex align-items-center fw-bold text-primary mb-3">
                                                <span className="badge bg-primary rounded-pill me-2">1</span> Red Blood Cell Transfusions
                                            </h4>
                                            <p className="text-secondary mb-3">
                                                The cornerstone of treatment for Thalassemia Major. Patients receive healthy blood from donors.
                                            </p>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <div className="p-3 border rounded-3 bg-light h-100">
                                                        <strong>Frequency:</strong> Typically every 2–4 weeks.
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="p-3 border rounded-3 bg-light h-100">
                                                        <strong>Goal:</strong> Maintain Hemoglobin levels above 9.5 g/dL.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Chelation */}
                                        <div className="mb-5">
                                            <h4 className="d-flex align-items-center fw-bold text-warning mb-3">
                                                <span className="badge bg-warning text-dark rounded-pill me-2">2</span> Iron Chelation Therapy
                                            </h4>
                                            <div className="alert alert-warning border-0 d-flex align-items-center rounded-3">
                                                <FaInfoCircle className="me-3 flex-shrink-0" size={24} />
                                                <div>
                                                    <strong>The Iron Challenge:</strong> Each unit of blood contains ~200mg of iron. The body has no natural way to remove this excess iron, which can become toxic to the heart and liver.
                                                </div>
                                            </div>
                                            <p className="text-secondary fw-bold">Common Chelators:</p>
                                            <ul className="text-muted">
                                                <li><strong>Deferasirox (Exjade/Jadenu):</strong> Oral tablet, taken daily. Most common.</li>
                                                <li><strong>Deferiprone (Ferriprox):</strong> Oral tablet/liquid, taken 3 times daily.</li>
                                                <li><strong>Deferoxamine (Desferal):</strong> Subcutaneous infusion via a small pump (8-12 hours overnight). Oldest and highly effective method.</li>
                                            </ul>
                                        </div>

                                        {/* Cure */}
                                        <div className="mb-4">
                                            <h4 className="d-flex align-items-center fw-bold text-info mb-3">
                                                <span className="badge bg-info text-white rounded-pill me-2">3</span> Curative Options
                                            </h4>
                                            <Card className="border-0 bg-info bg-opacity-10 rounded-3 p-3">
                                                <div className="d-flex mb-3">
                                                    <div className="me-3 fs-3">🧬</div>
                                                    <div>
                                                        <h6 className="fw-bold mb-1">Bone Marrow Transplant (BMT)</h6>
                                                        <p className="small mb-0">Replacing stem cells with healthy ones from a matching donor (usually a sibling). Best outcomes in young children.</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex">
                                                    <div className="me-3 fs-3">🔬</div>
                                                    <div>
                                                        <h6 className="fw-bold mb-1">Gene Therapy</h6>
                                                        <p className="small mb-0">Collecting a patient's own stem cells, correcting the gene in a lab, and re-infusing them. Approved in some countries (Zynteglo).</p>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            {/* DIET TAB */}
                            <Tab.Pane eventKey="diet">
                                <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                                    <div className="bg-danger p-4 p-lg-5 text-white position-relative overflow-hidden">
                                        <div className="position-relative z-1">
                                            <h2 className="display-6 fw-bold mb-3">Diet & Nutrition Analysis</h2>
                                            <p className="lead mb-0 opacity-90">What you eat significantly affects iron absorption.</p>
                                        </div>
                                        <FaAppleAlt size={160} className="position-absolute opacity-10" style={{ right: '-10px', bottom: '-20px' }} />
                                    </div>
                                    {/* ... KEEP EXISTING DIET CONTENT BUT STYLE IT BETTER ... */}
                                    <Card.Body className="p-4 p-lg-5">
                                        <div className="row g-4">
                                            <div className="col-lg-6">
                                                <Card className="h-100 border-success border-2 shadow-none">
                                                    <Card.Header className="bg-success text-white fw-bold">✅ RECOMMENDATIONS</Card.Header>
                                                    <Card.Body>
                                                        <div className="mb-3">
                                                            <h6 className="fw-bold text-success">Calcium & Vitamin D</h6>
                                                            <p className="small text-muted">Critical for bone health as thalassemia can cause weak bones (osteoporosis). Eat yogurt, cheese, milk, and almonds.</p>
                                                        </div>
                                                        <div className="mb-3">
                                                            <h6 className="fw-bold text-success">Black Tea</h6>
                                                            <p className="small text-muted">Drink a cup of strong black tea with meals. Tannins in tea significantly <strong>inhibit iron absorption</strong> from food.</p>
                                                        </div>
                                                        <div className="mb-3">
                                                            <h6 className="fw-bold text-success">Vitamin E & Folic Acid</h6>
                                                            <p className="small text-muted">Antioxidants help protect red blood cells. Vegetable oils, nuts, and prescribed supplements.</p>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                            <div className="col-lg-6">
                                                <Card className="h-100 border-danger border-2 shadow-none">
                                                    <Card.Header className="bg-danger text-white fw-bold">❌ AVOID / RESTRICT</Card.Header>
                                                    <Card.Body>
                                                        <div className="mb-3">
                                                            <h6 className="fw-bold text-danger">Iron-Rich Foods (Heme Iron)</h6>
                                                            <p className="small text-muted">Limit red meats (Beef, Lamb, Liver, Pork). These contain iron that is easily absorbed by the body.</p>
                                                        </div>
                                                        <div className="mb-3">
                                                            <h6 className="fw-bold text-danger">Vitamin C with Meals</h6>
                                                            <p className="small text-muted">Vitamin C increases iron absorption by 10x! Do not drink orange juice with your burger. Take Vitamin C only as prescribed (usually with Desferal).</p>
                                                        </div>
                                                        <div className="mb-3">
                                                            <h6 className="fw-bold text-danger">Cast Iron Cookware</h6>
                                                            <p className="small text-muted">Cooking in iron pots leaches significant amounts of iron into the food.</p>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            {/* LIFESTYLE TAB */}
                            <Tab.Pane eventKey="lifestyle">
                                <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                                    <div className="bg-secondary p-4 p-lg-5 text-white position-relative overflow-hidden">
                                        <div className="position-relative z-1">
                                            <h2 className="display-6 fw-bold mb-3">Living Well</h2>
                                            <p className="lead mb-0 opacity-90">Mental health, exercise, and daily routine.</p>
                                        </div>
                                        <FaRunning size={180} className="position-absolute opacity-10" style={{ right: '-20px', bottom: '-40px' }} />
                                    </div>
                                    <Card.Body className="p-4 p-lg-5">
                                        <div className="row g-5">
                                            <div className="col-md-6">
                                                <div className="d-flex mb-3">
                                                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>🏃</div>
                                                    <div>
                                                        <h5 className="fw-bold">Exercise</h5>
                                                        <p className="text-muted small">Low-impact activities like walking, swimming, and cycling are excellent. Avoid high-impact sports if you have enlarged spleen or weak bones.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="d-flex mb-3">
                                                    <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>💉</div>
                                                    <div>
                                                        <h5 className="fw-bold">Vaccinations</h5>
                                                        <p className="text-muted small">Stay up to date. Especially for Hepatitis B (due to transfusions) and Flu/Pneumococcal (if spleen is removed).</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <Card className="border-0 bg-light p-4 rounded-4">
                                                    <div className="d-flex align-items-center mb-3">
                                                        <FaBrain size={30} className="text-primary me-3" />
                                                        <h4 className="fw-bold text-primary mb-0">Mental Health Matters</h4>
                                                    </div>
                                                    <p className="text-muted">Living with a chronic condition is challenging. It is normal to feel overwhelmed.</p>
                                                    <ul>
                                                        <li><strong>Join Support Groups:</strong> Connect with others in our "Community" tab.</li>
                                                        <li><strong>Talk to Friends:</strong> Don't isolate yourself.</li>
                                                        <li><strong>Therapy:</strong> Professional counseling can help manage anxiety about treatment schedules.</li>
                                                    </ul>
                                                </Card>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            {/* FAQ Tab */}
                            <Tab.Pane eventKey="faq">
                                <Card className="border-0 shadow-sm rounded-4 mb-4">
                                    <div className="bg-dark p-4 p-lg-5 text-white">
                                        <h2 className="display-6 fw-bold mb-0">Frequently Asked Questions</h2>
                                    </div>
                                    <Card.Body className="p-4">
                                        <Accordion flush>
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Header><strong>Can someone with Thalassemia live a normal life?</strong></Accordion.Header>
                                                <Accordion.Body>
                                                    Yes! With proper compliance to transfusion and chelation therapy, patients can live long, productive lives, have careers, and start families.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                            <Accordion.Item eventKey="1">
                                                <Accordion.Header><strong>Is Thalassemia contagious?</strong></Accordion.Header>
                                                <Accordion.Body>
                                                    No. You cannot catch it like a cold. It is purely genetic, inherited from parents.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                            <Accordion.Item eventKey="2">
                                                <Accordion.Header><strong>Should I undergo carrier screening?</strong></Accordion.Header>
                                                <Accordion.Body>
                                                    Yes. If you have a family history or belong to a high-risk ethnic group (Mediterranean, Asian, African), it is recommended to get tested before marriage or pregnancy to understand the risks.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                            <Accordion.Item eventKey="3">
                                                <Accordion.Header><strong>What happens if I miss a transfusion?</strong></Accordion.Header>
                                                <Accordion.Body>
                                                    Missing a transfusion causes hemoglobin levels to drop. You will feel extremely tired, weak, and short of breath. Chronic missed transfusions lead to severe complications.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>

            <style jsx>{`
                .fade-in-up {
                    animation: fadeInUp 0.8s ease-out;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .nav-pills .nav-link {
                    color: #4b5563;
                    transition: all 0.3s ease;
                }
                .nav-pills .nav-link:hover {
                    background-color: #f3f4f6;
                    color: #1e3a8a;
                    transform: translateX(5px);
                }
                .nav-pills .nav-link.active {
                    background-color: #1e3a8a;
                    color: white;
                    box-shadow: 0 4px 6px -1px rgba(30, 58, 138, 0.5);
                }
            `}</style>
        </Container>
    );
};

export default Resources;
