import Link from "next/link";
import "./BookCard.scss";
interface BookCardProps {
  article: Article;
  index: number;
}

export interface Article {
  id: number | string;
  title: string;
  summary?: string;
  author?: string;
  date?: string;
  /**
   * 跳转的地址
   */
  slug?: string;
}

const BookCard: React.FC<BookCardProps> = ({ article, index }) => {
  return (
    <div className="book-card-container">
      <div className="book-card">
        <div className="card-front">
          <div className="paper-texture"></div>
          <div className="card-decoration">
            <i className="fas fa-book-open"></i>
            <span className="folio-number">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="card-title">{article.title}</h3>
          <div className="card-divider"></div>
          <p className="card-summary">{article.summary}</p>
          <div className="card-footer">
            {article.author && (
              <span>
                <i className="fas fa-feather-alt"></i> {article.author}
              </span>
            )}
            {article.date && (
              <span>
                <i className="far fa-calendar-alt"></i> {article.date}
              </span>
            )}

            {article.slug && (
              <Link href={article.slug}>
                <span className="read-tod">阅读</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
