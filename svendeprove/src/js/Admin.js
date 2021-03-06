import React from "react";
import { Redirect } from "react-router-dom";
import Container from "./Container";
import Popup from "./Popup";
import Form from "./Form";
import FormElement from "./FormElement";
import { ENDPOINT } from "./Global";

import Loading from "./Loading";

import "../css/Admin.scss";

class Admin extends React.Component {
    constructor() {
        super();
        this.admin = document.cookie
            .split("; ")
            .find((row) => row.startsWith("admin="));
        if (this.admin !== undefined) {
            this.admin = this.admin.split("=")[1];
        }

        this.state = {
            animals: [],
            assets: [],
            volunteers: [],
            abouts: [],
            adoptsections: [],
            popup: { title: "", children: <></>, visible: false },
        };
        this.abortController = new AbortController();
    }

    convertdata(data) {
        let fData = "";
        Object.entries(data).forEach((entry) => {
            fData += `${fData ? "&" : ""}${encodeURIComponent(
                entry[0]
            )}=${encodeURIComponent(entry[1])}`;
        });
        return fData;
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    componentDidMount() {
        // GET Adoptsections
        fetch(`${ENDPOINT}/api/v1/adoptsections`, {
            signal: this.abortController.signal,
        })
            .then((e) => e.json())
            .then((data) => {
                this.setState({ adoptsections: data });
            });

        // GET About
        fetch(`${ENDPOINT}/api/v1/abouts`, {
            signal: this.abortController.signal,
        })
            .then((e) => e.json())
            .then((data) => {
                this.setState({ abouts: data });
            });

        // GET Volunteers
        fetch(`${ENDPOINT}/api/v1/volunteers`, {
            signal: this.abortController.signal,
        })
            .then((e) => e.json())
            .then((data) => {
                this.setState({ volunteers: data });
            });

        // GET Animals
        fetch(`${ENDPOINT}/api/v1/animals`, {
            signal: this.abortController.signal,
        })
            .then((e) => e.json())
            .then((data) => {
                this.setState({ animals: data });
            });

        // GET Assets
        fetch(`${ENDPOINT}/api/v1/assets`, {
            signal: this.abortController.signal,
        })
            .then((e) => e.json())
            .then((data) => {
                this.setState({ assets: data });
            });
    }

    render() {
        return this.admin === undefined ? (
            <Redirect to="/login" />
        ) : (
            <main className="admin">
                <Container>
                    <h1>Content Management System</h1>
                    <h2>Sections</h2>
                    <section className="admin-section admin-sections">
                        {this.state.adoptsections.map((section, i) => {
                            return (
                                <div
                                    className="admin-item"
                                    key={i}
                                    onClick={() => {
                                        this.setState({
                                            popup: {
                                                title: `Modificer "${section.title}"`,
                                                visible: true,
                                                children: (
                                                    <Form
                                                        onValid={async (
                                                            data
                                                        ) => {
                                                            await fetch(
                                                                `${ENDPOINT}/api/v1/adoptsections/${section.id}`,
                                                                {
                                                                    method:
                                                                        "PUT",
                                                                    headers: {
                                                                        "Content-Type":
                                                                            "application/x-www-form-urlencoded",
                                                                        Authorization: `Bearer ${this.admin}`,
                                                                    },
                                                                    body: this.convertdata(
                                                                        data
                                                                    ),
                                                                }
                                                            )
                                                                .then((e) =>
                                                                    e.json()
                                                                )
                                                                .then(
                                                                    (data) => {
                                                                        const adoptsectionsUpdate = this
                                                                            .state
                                                                            .adoptsections;
                                                                        adoptsectionsUpdate[
                                                                            i
                                                                        ] = data;

                                                                        this.setState(
                                                                            {
                                                                                adoptsections: adoptsectionsUpdate,
                                                                            }
                                                                        );
                                                                    }
                                                                );

                                                            this.setState({
                                                                popup: {
                                                                    visible: false,
                                                                },
                                                            });
                                                        }}
                                                        onCancel={() => {
                                                            this.setState({
                                                                popup: {
                                                                    visible: false,
                                                                },
                                                            });
                                                        }}
                                                        submitLabel="Gem"
                                                        cancelLabel="Luk"
                                                    >
                                                        <FormElement
                                                            type="text"
                                                            id="title"
                                                            label="Title"
                                                            default={
                                                                section.title
                                                            }
                                                            required
                                                        />

                                                        <FormElement
                                                            type="number"
                                                            id="assetId"
                                                            label="Asset ID"
                                                            min={1}
                                                            max={
                                                                this.state
                                                                    .assets
                                                                    .length
                                                            }
                                                            default={
                                                                section.asset.id
                                                            }
                                                            required
                                                        />

                                                        <FormElement
                                                            type="textarea"
                                                            id="content"
                                                            label="Content"
                                                            default={
                                                                section.content
                                                            }
                                                            required
                                                        />
                                                    </Form>
                                                ),
                                            },
                                        });
                                    }}
                                >
                                    {section.title}
                                </div>
                            );
                        })}
                    </section>

                    <h2>Abouts</h2>
                    <section className="admin-section admin-about">
                        {this.state.abouts.map((about, i) => {
                            return (
                                <div
                                    className="admin-item"
                                    key={i}
                                    onClick={() => {
                                        this.setState({
                                            popup: {
                                                title: `Modificer "${about.title}"`,
                                                visible: true,
                                                children: (
                                                    <Form
                                                        onValid={async (
                                                            data
                                                        ) => {
                                                            await fetch(
                                                                `${ENDPOINT}/api/v1/abouts/${about.id}`,
                                                                {
                                                                    method:
                                                                        "PUT",
                                                                    headers: {
                                                                        "Content-Type":
                                                                            "application/x-www-form-urlencoded",
                                                                        Authorization: `Bearer ${this.admin}`,
                                                                    },
                                                                    body: this.convertdata(
                                                                        data
                                                                    ),
                                                                }
                                                            )
                                                                .then((e) =>
                                                                    e.json()
                                                                )
                                                                .then(
                                                                    (data) => {
                                                                        const aboutsUpdate = this
                                                                            .state
                                                                            .abouts;
                                                                        aboutsUpdate[
                                                                            i
                                                                        ] = data;

                                                                        this.setState(
                                                                            {
                                                                                abouts: aboutsUpdate,
                                                                            }
                                                                        );
                                                                    }
                                                                );

                                                            this.setState({
                                                                popup: {
                                                                    visible: false,
                                                                },
                                                            });
                                                        }}
                                                        onCancel={() => {
                                                            this.setState({
                                                                popup: {
                                                                    visible: false,
                                                                },
                                                            });
                                                        }}
                                                        submitLabel="Gem"
                                                        cancelLabel="Luk"
                                                    >
                                                        <FormElement
                                                            type="text"
                                                            id="title"
                                                            label="Title"
                                                            default={
                                                                about.title
                                                            }
                                                            required
                                                        />

                                                        <FormElement
                                                            type="textarea"
                                                            id="content"
                                                            label="Content"
                                                            default={
                                                                about.content
                                                            }
                                                            required
                                                        />
                                                    </Form>
                                                ),
                                            },
                                        });
                                    }}
                                >
                                    {about.title}
                                </div>
                            );
                        })}
                    </section>

                    <h2>Volunteers</h2>
                    <section className="admin-section admin-animals">
                        {this.state.volunteers.map((volunteer, i) => {
                            return (
                                <div
                                    className="admin-item"
                                    key={i}
                                    onClick={(e) => {
                                        if (
                                            e.target.classList.contains(
                                                "admin-item-delete"
                                            )
                                        ) {
                                            return;
                                        }

                                        this.setState({
                                            popup: {
                                                title: `Modificer "${volunteer.title}"`,
                                                visible: true,
                                                children: (
                                                    <Form
                                                        onValid={async (
                                                            data
                                                        ) => {
                                                            await fetch(
                                                                `${ENDPOINT}/api/v1/volunteers/${volunteer.id}`,
                                                                {
                                                                    method:
                                                                        "PUT",
                                                                    headers: {
                                                                        "Content-Type":
                                                                            "application/x-www-form-urlencoded",
                                                                        Authorization: `Bearer ${this.admin}`,
                                                                    },
                                                                    body: this.convertdata(
                                                                        data
                                                                    ),
                                                                }
                                                            )
                                                                .then((e) =>
                                                                    e.json()
                                                                )
                                                                .then(
                                                                    (data) => {
                                                                        const volunteersUpdate = this
                                                                            .state
                                                                            .volunteers;
                                                                        volunteersUpdate[
                                                                            i
                                                                        ] = data;

                                                                        this.setState(
                                                                            {
                                                                                volunteers: volunteersUpdate,
                                                                            }
                                                                        );
                                                                    }
                                                                );

                                                            this.setState({
                                                                popup: {
                                                                    visible: false,
                                                                },
                                                            });
                                                        }}
                                                        onCancel={() => {
                                                            this.setState({
                                                                popup: {
                                                                    visible: false,
                                                                },
                                                            });
                                                        }}
                                                        submitLabel="Gem"
                                                        cancelLabel="Luk"
                                                    >
                                                        <FormElement
                                                            type="text"
                                                            id="title"
                                                            label="Title"
                                                            default={
                                                                volunteer.title
                                                            }
                                                            required
                                                        />

                                                        <FormElement
                                                            type="textarea"
                                                            id="content"
                                                            label="Content"
                                                            default={
                                                                volunteer.content
                                                            }
                                                            required
                                                        />

                                                        <FormElement
                                                            type="number"
                                                            id="assetId"
                                                            label="Asset"
                                                            default={
                                                                volunteer.asset
                                                                    .id
                                                            }
                                                            min={1}
                                                            max={
                                                                this.state
                                                                    .assets
                                                                    .length
                                                            }
                                                            required
                                                        />

                                                        <FormElement
                                                            type="textarea"
                                                            id="extra"
                                                            label="Extra"
                                                            default={
                                                                volunteer.extra
                                                            }
                                                        />
                                                    </Form>
                                                ),
                                            },
                                        });
                                    }}
                                >
                                    {volunteer.title}

                                    <div
                                        className="admin-item-delete"
                                        onClick={() => {
                                            this.setState({
                                                popup: {
                                                    title: `Er du sikker på at du vil slette "${volunteer.title}"?`,
                                                    visible: true,
                                                    children: (
                                                        <Form
                                                            onValid={async (
                                                                data
                                                            ) => {
                                                                await fetch(
                                                                    `${ENDPOINT}/api/v1/volunteers/${volunteer.id}`,
                                                                    {
                                                                        method:
                                                                            "DELETE",
                                                                        headers: {
                                                                            "Content-Type":
                                                                                "application/x-www-form-urlencoded",
                                                                            Authorization: `Bearer ${this.admin}`,
                                                                        },
                                                                        body: this.convertdata(
                                                                            data
                                                                        ),
                                                                    }
                                                                ).then(() => {
                                                                    const volunteersUpdate = this
                                                                        .state
                                                                        .volunteers;
                                                                    volunteersUpdate.splice(
                                                                        i
                                                                    );

                                                                    this.setState(
                                                                        {
                                                                            volunteers: volunteersUpdate,
                                                                        }
                                                                    );
                                                                });

                                                                this.setState({
                                                                    popup: {
                                                                        visible: false,
                                                                    },
                                                                });
                                                            }}
                                                            onCancel={() => {
                                                                this.setState({
                                                                    popup: {
                                                                        visible: false,
                                                                    },
                                                                });
                                                            }}
                                                            submitLabel="Ja"
                                                            cancelLabel="Nej"
                                                        ></Form>
                                                    ),
                                                },
                                            });
                                        }}
                                    >
                                        X
                                    </div>
                                </div>
                            );
                        })}

                        <button
                            className="admin-button"
                            onClick={() => {
                                this.setState({
                                    popup: {
                                        title: "Tilføj Volunteer",
                                        visible: true,
                                        children: (
                                            <Form
                                                onValid={async (data) => {
                                                    await fetch(
                                                        `${ENDPOINT}/api/v1/volunteers`,
                                                        {
                                                            method: "POST",
                                                            headers: {
                                                                "Content-Type":
                                                                    "application/x-www-form-urlencoded",
                                                                Authorization: `Bearer ${this.admin}`,
                                                            },
                                                            body: this.convertdata(
                                                                data
                                                            ),
                                                        }
                                                    )
                                                        .then((e) => e.json())
                                                        .then((data) => {
                                                            const volunteersUpdate = this
                                                                .state
                                                                .volunteers;
                                                            volunteersUpdate.push(
                                                                data
                                                            );

                                                            this.setState({
                                                                volunteers: volunteersUpdate,
                                                            });
                                                        });

                                                    this.setState({
                                                        popup: {
                                                            visible: false,
                                                        },
                                                    });
                                                }}
                                                onCancel={() => {
                                                    this.setState({
                                                        popup: {
                                                            visible: false,
                                                        },
                                                    });
                                                }}
                                                submitLabel="Tilføj"
                                                cancelLabel="Luk"
                                            >
                                                <FormElement
                                                    type="text"
                                                    id="title"
                                                    label="Title"
                                                    required
                                                />

                                                <FormElement
                                                    type="textarea"
                                                    id="content"
                                                    label="Content"
                                                    required
                                                />

                                                <FormElement
                                                    type="number"
                                                    id="assetId"
                                                    label="Asset"
                                                    min={1}
                                                    max={
                                                        this.state.assets.length
                                                    }
                                                    required
                                                />

                                                <FormElement
                                                    type="textarea"
                                                    id="extra"
                                                    label="Extra"
                                                />
                                            </Form>
                                        ),
                                    },
                                });
                            }}
                        >
                            +
                        </button>
                    </section>

                    <h2>Animals</h2>
                    <section className="admin-section admin-animals">
                        {this.state.animals.map((animal, i) => {
                            return (
                                <div
                                    className="admin-item"
                                    key={i}
                                    onClick={(e) => {
                                        if (
                                            e.target.classList.contains(
                                                "admin-item-delete"
                                            )
                                        ) {
                                            return;
                                        }

                                        this.setState({
                                            popup: {
                                                title: `Modificer ${animal.name}`,
                                                visible: true,
                                                children: (
                                                    <Form
                                                        onValid={async (
                                                            data
                                                        ) => {
                                                            await fetch(
                                                                `${ENDPOINT}/api/v1/animals/${animal.id}`,
                                                                {
                                                                    method:
                                                                        "PUT",
                                                                    headers: {
                                                                        "Content-Type":
                                                                            "application/x-www-form-urlencoded",
                                                                        Authorization: `Bearer ${this.admin}`,
                                                                    },
                                                                    body: this.convertdata(
                                                                        data
                                                                    ),
                                                                }
                                                            )
                                                                .then((e) =>
                                                                    e.json()
                                                                )
                                                                .then(
                                                                    (data) => {
                                                                        const animalsUpdate = this
                                                                            .state
                                                                            .animals;
                                                                        animalsUpdate[
                                                                            i
                                                                        ] = data;

                                                                        this.setState(
                                                                            {
                                                                                animals: animalsUpdate,
                                                                            }
                                                                        );
                                                                    }
                                                                );

                                                            this.setState({
                                                                popup: {
                                                                    visible: false,
                                                                },
                                                            });
                                                        }}
                                                        onCancel={() => {
                                                            this.setState({
                                                                popup: {
                                                                    visible: false,
                                                                },
                                                            });
                                                        }}
                                                        submitLabel="Gem"
                                                        cancelLabel="Luk"
                                                    >
                                                        <FormElement
                                                            type="text"
                                                            id="name"
                                                            label="Name"
                                                            default={
                                                                animal.name
                                                            }
                                                            required
                                                        />

                                                        <FormElement
                                                            type="textarea"
                                                            id="description"
                                                            label="Description"
                                                            default={
                                                                animal.description
                                                            }
                                                            required
                                                        />

                                                        <FormElement
                                                            type="number"
                                                            id="assetId"
                                                            label="Asset"
                                                            min={1}
                                                            max={
                                                                this.state
                                                                    .assets
                                                                    .length
                                                            }
                                                            default={
                                                                animal.asset.id
                                                            }
                                                            required
                                                        />

                                                        <FormElement
                                                            type="number"
                                                            id="age"
                                                            label="Age"
                                                            min={0}
                                                            default={animal.age}
                                                            required
                                                        />
                                                    </Form>
                                                ),
                                            },
                                        });
                                    }}
                                >
                                    {animal.name}

                                    <div
                                        className="admin-item-delete"
                                        onClick={() => {
                                            this.setState({
                                                popup: {
                                                    title: `Er du sikker på at du vil slette "${animal.name}"?`,
                                                    visible: true,
                                                    children: (
                                                        <Form
                                                            onValid={async (
                                                                data
                                                            ) => {
                                                                await fetch(
                                                                    `${ENDPOINT}/api/v1/animals/${animal.id}`,
                                                                    {
                                                                        method:
                                                                            "DELETE",
                                                                        headers: {
                                                                            "Content-Type":
                                                                                "application/x-www-form-urlencoded",
                                                                            Authorization: `Bearer ${this.admin}`,
                                                                        },
                                                                        body: this.convertdata(
                                                                            data
                                                                        ),
                                                                    }
                                                                ).then(() => {
                                                                    const animalsUpdate = this
                                                                        .state
                                                                        .animals;
                                                                    animalsUpdate.splice(
                                                                        i
                                                                    );

                                                                    this.setState(
                                                                        {
                                                                            animals: animalsUpdate,
                                                                        }
                                                                    );
                                                                });

                                                                this.setState({
                                                                    popup: {
                                                                        visible: false,
                                                                    },
                                                                });
                                                            }}
                                                            onCancel={() => {
                                                                this.setState({
                                                                    popup: {
                                                                        visible: false,
                                                                    },
                                                                });
                                                            }}
                                                            submitLabel="Ja"
                                                            cancelLabel="Nej"
                                                        ></Form>
                                                    ),
                                                },
                                            });
                                        }}
                                    >
                                        X
                                    </div>
                                </div>
                            );
                        })}

                        <button
                            className="admin-button"
                            onClick={() => {
                                this.setState({
                                    popup: {
                                        title: "Tilføj Animal",
                                        visible: true,
                                        children: (
                                            <Form
                                                onValid={async (data) => {
                                                    await fetch(
                                                        `${ENDPOINT}/api/v1/animals`,
                                                        {
                                                            method: "POST",
                                                            headers: {
                                                                "Content-Type":
                                                                    "application/x-www-form-urlencoded",
                                                                Authorization: `Bearer ${this.admin}`,
                                                            },
                                                            body: this.convertdata(
                                                                data
                                                            ),
                                                        }
                                                    )
                                                        .then((e) => e.json())
                                                        .then((data) => {
                                                            const animalsUpdate = this
                                                                .state.animals;
                                                            animalsUpdate.push(
                                                                data
                                                            );

                                                            this.setState({
                                                                animals: animalsUpdate,
                                                            });
                                                        });

                                                    this.setState({
                                                        popup: {
                                                            visible: false,
                                                        },
                                                    });
                                                }}
                                                onCancel={() => {
                                                    this.setState({
                                                        popup: {
                                                            visible: false,
                                                        },
                                                    });
                                                }}
                                                submitLabel="Tilføj"
                                                cancelLabel="Luk"
                                            >
                                                <FormElement
                                                    type="text"
                                                    id="name"
                                                    label="Name"
                                                    required
                                                />

                                                <FormElement
                                                    type="textarea"
                                                    id="description"
                                                    label="Description"
                                                    required
                                                />

                                                <FormElement
                                                    type="number"
                                                    id="assetId"
                                                    label="Asset"
                                                    min={1}
                                                    max={
                                                        this.state.assets.length
                                                    }
                                                    required
                                                />

                                                <FormElement
                                                    type="number"
                                                    id="age"
                                                    label="Age"
                                                    min={0}
                                                    required
                                                />
                                            </Form>
                                        ),
                                    },
                                });
                            }}
                        >
                            +
                        </button>
                    </section>

                    <h2>Assets</h2>
                    <section className="admin-section admin-assets">
                        {this.state.assets.map((asset, i) => {
                            return (
                                <div
                                    className="admin-item"
                                    style={{
                                        backgroundImage: `url(${encodeURI(
                                            asset.url
                                        )})`,
                                    }}
                                    key={i}
                                    onClick={(e) => {
                                        if (
                                            e.target.classList.contains(
                                                "admin-item-delete"
                                            )
                                        ) {
                                            return;
                                        }

                                        this.setState({
                                            popup: {
                                                title: `Asset ID: ${asset.id}`,
                                                visible: true,
                                                children: (
                                                    <Form
                                                        onValid={() => {
                                                            this.setState({
                                                                popup: {
                                                                    visible: false,
                                                                },
                                                            });
                                                        }}
                                                        submitLabel="Luk"
                                                    >
                                                        <img
                                                            src={encodeURI(
                                                                asset.url
                                                            )}
                                                            alt="Animal"
                                                        />
                                                    </Form>
                                                ),
                                            },
                                        });
                                    }}
                                >
                                    {/*<div
                                        className="admin-item-delete"
                                        onClick={() => {
                                            this.setState({
                                                popup: {
                                                    title: `Er du sikker på at du vil slette asset ${asset.id}?`,
                                                    visible: true,
                                                    children: (
                                                        <Form
                                                            onValid={async (
                                                                data
                                                            ) => {
                                                                await fetch(
                                                                    `${ENDPOINT}/api/v1/assets/${asset.id}`,
                                                                    {
                                                                        method:
                                                                            "DELETE",
                                                                        headers: {
                                                                            "Content-Type":
                                                                                "application/x-www-form-urlencoded",
                                                                            Authorization: `Bearer ${this.admin}`,
                                                                        },
                                                                        body: this.convertdata(
                                                                            data
                                                                        ),
                                                                    }
                                                                ).then(() => {
                                                                    const assetsUpdate = this
                                                                        .state
                                                                        .assets;
                                                                    assetsUpdate.splice(
                                                                        i
                                                                    );

                                                                    this.setState(
                                                                        {
                                                                            assets: assetsUpdate,
                                                                        }
                                                                    );
                                                                });

                                                                this.setState({
                                                                    popup: {
                                                                        visible: false,
                                                                    },
                                                                });
                                                            }}
                                                            onCancel={() => {
                                                                this.setState({
                                                                    popup: {
                                                                        visible: false,
                                                                    },
                                                                });
                                                            }}
                                                            submitLabel="Ja"
                                                            cancelLabel="Nej"
                                                        ></Form>
                                                    ),
                                                },
                                            });
                                        }}
                                    >
                                        X
                                    </div>*/}
                                </div>
                            );
                        })}

                        <button
                            className="admin-button"
                            onClick={() => {
                                this.setState({
                                    popup: {
                                        title: "Tilføj Asset",
                                        visible: true,
                                        children: (
                                            <Form
                                                onValid={async (data) => {
                                                    const fData = new FormData();
                                                    fData.append(
                                                        "file",
                                                        data.file[0]
                                                    );

                                                    await fetch(
                                                        `${ENDPOINT}/api/v1/assets`,
                                                        {
                                                            method: "POST",
                                                            headers: {
                                                                Authorization: `Bearer ${this.admin}`,
                                                            },
                                                            body: fData,
                                                        }
                                                    )
                                                        .then((e) => e.json())
                                                        .then((data) => {
                                                            const assetsUpdate = this
                                                                .state.assets;
                                                            assetsUpdate.push(
                                                                data
                                                            );

                                                            this.setState({
                                                                assets: assetsUpdate,
                                                            });
                                                        })
                                                        .catch((e) => {
                                                            console.error(e);
                                                        });

                                                    this.setState({
                                                        popup: {
                                                            visible: false,
                                                        },
                                                    });
                                                }}
                                                onCancel={() => {
                                                    this.setState({
                                                        popup: {
                                                            visible: false,
                                                        },
                                                    });
                                                }}
                                                submitLabel="Tilføj"
                                                cancelLabel="Luk"
                                            >
                                                <FormElement
                                                    type="file"
                                                    id="file"
                                                    accept="image/*"
                                                    label="File"
                                                    required
                                                />
                                            </Form>
                                        ),
                                    },
                                });
                            }}
                        >
                            +
                        </button>
                    </section>
                </Container>

                <Popup
                    title={this.state.popup.title}
                    visible={this.state.popup.visible}
                >
                    {this.state.popup.children}
                </Popup>

                {this.state.abouts.length > 0 &&
                this.state.adoptsections.length > 0 &&
                this.state.animals.length > 0 &&
                this.state.assets.length > 0 &&
                this.state.volunteers.length > 0 ? null : (
                    <Loading />
                )}
            </main>
        );
    }
}

export default Admin;
