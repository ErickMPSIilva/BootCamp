import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import { Loading, Owner, IssueList, FilterList, PageActions } from './styles';
import Container from '../../components/styles';

export default class Repository extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    repository: {},
    issues: [],
    loading: false,
    filters: [
      { state: 'all', label: 'Todos', active: true },
      { state: 'open', label: 'Abertos', active: false },
      { state: 'closed', label: 'Fechados', active: false },
    ],
    page: 1,
    indexFilter: 0,
  };

  async componentDidMount() {
    // eslint-disable-next-line react/prop-types
    const { match } = this.props;

    const { filters } = this.state;

    this.state.loading = true;

    // eslint-disable-next-line react/prop-types
    const repoName = decodeURIComponent(match.params.repository);

    const [repositories, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: filters.find(f => f.active).state,
          per_page: 30,
        },
      }),
    ]);

    this.setState({
      repository: repositories.data,
      issues: issues.data,
      loading: false,
    });
  }

  handleIssue = async () => {
    const { match } = this.props;
    const { filters, indexFilter, page } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    const response = await api.get(`/repos/${repoName}/issues`, {
      params: filters[indexFilter].state,
      per_page: 5,
      page,
    });

    this.setState({ issues: response.data });
  };

  handleFilter = async filterIndex => {
    await this.setState({ filterIndex });
    this.handleIssue();
  };

  handleList = async action => {
    const { page } = this.state;
    await this.setState({
      page: action === 'back' ? page - 1 : page + 1,
    });

    this.handleIssue();
  };

  static propType = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  render() {
    const {
      repository,
      issues,
      loading,
      filters,
      indexFilter,
      page,
    } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositorios</Link>
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        <IssueList>
          <FilterList active={indexFilter}>
            {filters.map((filter, index) => (
              <button
                type="button"
                key={filter.label}
                onClick={() => this.handleFilter(index)}
              >
                {filter.label}
              </button>
            ))}
          </FilterList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
        <PageActions>
          <button
            type="button"
            disabled={page < 2}
            onClick={() => this.handleList('back')}
          >
            Anterior
          </button>
          <span>Página {page}</span>
          <button type="button" onClick={() => this.handleList('next')}>
            Próximo
          </button>
        </PageActions>
      </Container>
    );
  }
}
